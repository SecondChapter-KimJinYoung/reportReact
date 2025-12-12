/**
 * API 클라이언트 및 인터셉터
 *
 * Axios 기반 HTTP 클라이언트로 API 통신을 관리합니다.
 * 자동 토큰 갱신, 요청/응답 인터셉터, 에러 핸들링을 제공합니다.
 *
 * @example
 * // 기본 사용 (토큰 자동 추가)
 * const data = await get('/api/v1/users', { page: 1, limit: 10 });
 * const result = await post('/api/v1/users', { name: 'John Doe' });
 * const updated = await patch('/api/v1/users/1', { name: 'Jane Doe' });
 * await del('/api/v1/users/1');
 * await uploadFile('/api/v1/users/1/avatar', file);
 *
 * @example
 * // 토큰 없이 요청 (공개 API, 로그인 등)
 * const publicData = await get('/api/v1/public/status', undefined, { skipAuth: true });
 * const loginResult = await post('/api/v1/auth/login', { email, password }, { skipAuth: true });
 * const publicFile = await uploadFile('/api/v1/public/upload', file, undefined, { skipAuth: true });
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import {
  API_CONFIG,
  HTTP_STATUS,
  STORAGE_KEYS,
  HEADERS,
  CONTENT_TYPE,
  API_MESSAGES,
} from './api.constants';
import { API_ENDPOINTS } from './api.endpoints';
import type { ApiResponse } from './api.types';
import { ROUTES } from '../routes/routes';
import { showToast } from '@/shared/components/Toast';
import { handleError } from './api.utils';
import { getErrorMessageByStatusCode } from './api.messages';
// file.ts utility functions (inline implementation)
const getMimeTypeFromFilename = (filename?: string): string => {
  const ext = (filename || '').split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    txt: 'text/plain',
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// ============================================
// 타입 정의
// ============================================

/** 토큰 갱신 대기 큐 아이템 */
interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

/** 토큰 갱신 응답 타입 */
interface TokenRefreshResponse {
  data: ApiResponse<{
    accessToken: string;
    refreshToken: string;
  }>;
}

/** 재시도 가능한 요청 타입 */
interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuth?: boolean;
}

/** 확장된 Axios 요청 설정 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  basicAuth?: {
    username: string;
    password: string;
  };
}

/** API 요청 옵션 */
export interface ApiRequestOptions {
  /** 인증 토큰을 헤더에 추가하지 않음 */
  skipAuth?: boolean;
  /** Basic Auth 인증 정보 */
  basicAuth?: {
    username: string;
    password: string;
  };
}

/** 에러 응답 데이터 타입 */
interface ErrorResponseData {
  message?: string;
  code?: string;
  errors?: string[];
  payload?: unknown;
}

// ============================================
// API 클라이언트 생성
// ============================================
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL + API_CONFIG.VERSION,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON,
  },
});

// ============================================
// 토큰 관리 시스템
// ============================================
class TokenManager {
  private isRefreshing = false;
  private failedQueue: QueueItem[] = [];

  /**
   * 대기 중인 요청들을 처리합니다.
   * @param error - 에러 발생 시 전달
   * @param token - 새로 발급받은 토큰
   */
  private processQueue(error: Error | null, token: string | null = null): void {
    this.failedQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  /**
   * 로그인 페이지로 리다이렉트합니다.
   * 아이디 저장 기능을 위해 REMEMBERED_EMAIL은 보존합니다.
   */
  redirectToLogin(): void {
    // 아이디 저장 기능을 위해 REMEMBERED_EMAIL은 보존
    const rememberedEmail = localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL);

    // 인증 관련 데이터만 삭제
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);

    // REMEMBERED_EMAIL 복원
    if (rememberedEmail) {
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, rememberedEmail);
    }

    // TODO: 라우터 시스템 구축 후 router.push(ROUTES.AUTH.LOGIN)로 변경
    window.location.href = ROUTES.AUTH.LOGIN;
  }

  /**
   * Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.
   * @returns 새로 발급받은 Access Token
   * @throws {Error} Refresh Token이 없거나 갱신 실패 시
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      throw new Error(API_MESSAGES.AUTH.NO_REFRESH_TOKEN);
    }

    try {
      // skipAuth: true로 설정하여 access token 없이 요청
      // body는 빈 객체 (서버가 쿠키로 refreshToken을 받음)
      const response = await apiClient.post<TokenRefreshResponse['data']>(
        API_ENDPOINTS.AUTH.REFRESH,
        {},
        { skipAuth: true } as ExtendedAxiosRequestConfig
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.payload;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      apiClient.defaults.headers.common[HEADERS.AUTHORIZATION] = `Bearer ${accessToken}`;

      return accessToken;
    } catch (error) {
      this.redirectToLogin();
      throw error instanceof Error ? error : new Error(API_MESSAGES.AUTH.TOKEN_REFRESH_FAILED);
    }
  }

  /**
   * 401 에러 발생 시 토큰을 갱신하고 원래 요청을 재시도합니다.
   * 동시에 여러 요청이 실패한 경우 큐에 추가하여 중복 갱신을 방지합니다.
   * @param originalRequest - 실패한 원본 요청
   * @returns 재시도된 요청의 응답
   */
  async handleTokenRefresh(originalRequest: RetryableRequest): Promise<AxiosResponse> {
    const activeToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!activeToken || !refreshToken) {
      this.redirectToLogin();
      return Promise.reject(new Error(API_MESSAGES.AUTH.NO_VALID_SESSION));
    }

    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers[HEADERS.AUTHORIZATION] = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      const newToken = await this.refreshToken();

      if (originalRequest.headers) {
        originalRequest.headers[HEADERS.AUTHORIZATION] = `Bearer ${newToken}`;
      }

      this.processQueue(null, newToken);
      return await apiClient(originalRequest);
    } catch (error) {
      this.processQueue(
        error instanceof Error ? error : new Error(API_MESSAGES.AUTH.TOKEN_REFRESH_FAILED),
        null
      );
      return Promise.reject(error);
    } finally {
      this.isRefreshing = false;
    }
  }
}

const tokenManager = new TokenManager();

// ============================================
// 요청 인터셉터
// ============================================
apiClient.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    if (import.meta.env.DEV) {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
      if (config.params) console.log('Params:', config.params);
      if (config.data) console.log('Data:', config.data);
    }

    // Basic Auth 처리
    if (config.basicAuth && config.headers) {
      const credentials = btoa(`${config.basicAuth.username}:${config.basicAuth.password}`);
      config.headers[HEADERS.AUTHORIZATION] = `Basic ${credentials}`;
      return config;
    }

    // skipAuth 플래그가 없을 때만 토큰 추가
    if (!config.skipAuth && !config.headers?.[HEADERS.AUTHORIZATION]) {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers[HEADERS.AUTHORIZATION] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: Error) => Promise.reject(error)
);

// ============================================
// 응답 인터셉터
// ============================================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log('API Response:', response.config.url, response.status);
    }
    return response;
  },
  async (error: AxiosError<ErrorResponseData>) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (!error.response) {
      console.error('Network Error:', error.message);
      // TODO: 토스트 시스템 구축 후 활성화
      // showNetworkErrorToast(API_MESSAGES.NETWORK.CONNECTION_ERROR);
      return Promise.reject(error);
    }

    if (import.meta.env.DEV) {
      console.error('Error:', error.response.data);
    }

    // 401 에러 발생 시 토큰 갱신 시도 (토큰 만료 시)
    if (
      error.response.status === HTTP_STATUS.UNAUTHORIZED &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuth
    ) {
      // 리프레시 토큰 엔드포인트 자체가 401이면 갱신 시도하지 않음
      if (originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH)) {
        tokenManager.redirectToLogin();
        return Promise.reject(error);
      }
      return tokenManager.handleTokenRefresh(originalRequest);
    }

    if (error.response.status === HTTP_STATUS.FORBIDDEN) {
      console.warn(API_MESSAGES.ERROR.FORBIDDEN);
      showToast({ message: API_MESSAGES.ERROR.FORBIDDEN, variant: 'error' });
    }

    const errorData = error.response.data;
    if (errorData?.message) {
      showToast({ message: errorData.message, variant: 'error' });
    }

    return Promise.reject(error);
  }
);

// ============================================
// 에러 핸들링
// ============================================

/**
 * API 에러 클래스
 * 서버에서 반환된 에러 정보를 구조화하여 관리합니다.
 */
export class ApiError extends Error {
  statusCode: number;
  code: string;
  errors: string[];

  constructor(statusCode: number, message: string, code: string, errors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

/**
 * 다양한 형태의 에러를 ApiError로 변환합니다.
 * @param error - 발생한 에러 (AxiosError, Error, unknown)
 * @returns 표준화된 ApiError 인스턴스
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const responseData = error.response?.data as ErrorResponseData | undefined;

    if (error.message === 'Network Error' || !error.response) {
      handleError(error, { fallbackMessage: API_MESSAGES.NETWORK.CONNECTION_ERROR, silent: true });
      return new ApiError(0, API_MESSAGES.NETWORK.CONNECTION_ERROR, 'NETWORK_ERROR');
    }

    const message = responseData?.message || getErrorMessageByStatusCode(statusCode);
    const code = responseData?.code || 'UNKNOWN_ERROR';
    const errors = responseData?.errors || [];
    handleError(error, { fallbackMessage: message, silent: true });
    return new ApiError(statusCode, message, code, errors);
  }

  handleError(error, { fallbackMessage: API_MESSAGES.SERVER_ERROR.INTERNAL, silent: true });
  return new ApiError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    API_MESSAGES.SERVER_ERROR.INTERNAL,
    'UNKNOWN_ERROR'
  );
};

// ============================================
// 편의 함수들
// ============================================

/**
 * GET 요청을 보냅니다.
 * @param url - 요청 URL
 * @param params - 쿼리 파라미터
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청)
 * @returns 응답 데이터
 * @throws {ApiError} 요청 실패 시
 */
export const get = async <TResponse, TParams = Record<string, unknown>>(
  url: string,
  params?: TParams,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  try {
    const response = await apiClient.get<TResponse>(url, {
      params: params as unknown,
      skipAuth: options?.skipAuth,
    } as ExtendedAxiosRequestConfig);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * POST 요청을 보냅니다.
 * @param url - 요청 URL
 * @param data - 요청 본문 데이터
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청)
 * @returns 응답 데이터
 * @throws {ApiError} 요청 실패 시
 */
export const post = async <TResponse, TData = unknown>(
  url: string,
  data?: TData,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  try {
    const response = await apiClient.post<TResponse>(
      url,
      data as unknown,
      {
        skipAuth: options?.skipAuth,
        basicAuth: options?.basicAuth,
      } as ExtendedAxiosRequestConfig
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * PATCH 요청을 보냅니다.
 * @param url - 요청 URL
 * @param data - 요청 본문 데이터
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청)
 * @returns 응답 데이터
 * @throws {ApiError} 요청 실패 시
 */
export const patch = async <TResponse, TData = unknown>(
  url: string,
  data?: TData,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  try {
    const response = await apiClient.patch<TResponse>(
      url,
      data as unknown,
      {
        skipAuth: options?.skipAuth,
      } as ExtendedAxiosRequestConfig
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * DELETE 요청을 보냅니다.
 * @param url - 요청 URL
 * @param data - 요청 본문 데이터 (선택)
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청)
 * @returns 응답 데이터
 * @throws {ApiError} 요청 실패 시
 */
export const del = async <TResponse, TData = unknown>(
  url: string,
  data?: TData,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  try {
    const response = await apiClient.delete<TResponse>(url, {
      data: data as unknown,
      skipAuth: options?.skipAuth,
    } as ExtendedAxiosRequestConfig);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * 파일을 업로드합니다.
 * @param url - 업로드 URL
 * @param file - 업로드할 파일
 * @param path - 저장 경로 (선택)
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청)
 * @returns 응답 데이터
 * @throws {ApiError} 업로드 실패 시
 */
export const uploadFile = async <T>(
  url: string,
  file: File,
  path?: string,
  options?: ApiRequestOptions
): Promise<T> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (path) {
      formData.append('path', path);
    }

    const response = await apiClient.post<T>(url, formData, {
      headers: {
        [HEADERS.CONTENT_TYPE]: CONTENT_TYPE.FORM_DATA,
      },
      skipAuth: options?.skipAuth,
    } as ExtendedAxiosRequestConfig);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * base64 응답을 Blob으로 변환하여 파일을 다운로드합니다.
 * 서버 응답 형식: { code: "SUCCESS", payload: "base64문자열" }
 * @param url - 다운로드 URL
 * @param data - 요청 데이터
 * @param filename - 파일명 (MIME 타입 추론용, API 요청에는 포함되지 않음)
 * @param options - 요청 옵션 (skipAuth: 토큰 없이 요청)
 * @returns Blob 데이터를 포함한 AxiosResponse
 * @throws {ApiError} 다운로드 실패 시
 */
export const downloadFileAsBlob = async <TData = unknown>(
  url: string,
  data: TData,
  filename?: string,
  options?: ApiRequestOptions
): Promise<AxiosResponse<Blob>> => {
  try {
    const response = await apiClient.post<ApiResponse<string>>(
      url,
      data as unknown,
      {
        timeout: 60000, // 60초 (대용량 파일 처리)
        skipAuth: options?.skipAuth,
      } as ExtendedAxiosRequestConfig
    );

    const base64String = response.data.payload;
    if (!base64String || typeof base64String !== 'string') {
      throw new Error('서버에서 base64 데이터를 받지 못했습니다.');
    }

    const mimeType = getMimeTypeFromFilename(filename) || 'application/octet-stream';
    const blob = base64ToBlob(base64String, mimeType);

    if (import.meta.env.DEV) {
      console.log('Blob created:', { type: blob.type, size: blob.size, filename });
    }

    return { ...response, data: blob } as AxiosResponse<Blob>;
  } catch (error) {
    throw handleApiError(error);
  }
};
