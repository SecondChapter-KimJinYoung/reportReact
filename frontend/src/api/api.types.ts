/**
 * 공통 타입 정의
 **/

// 기본 API 응답
export interface ApiResponse<T> {
  message: string;
  code: string;
  statusCode: number;
  errors: null | string[];
  payload: T;
}

// 리스트 응답
export interface ListResponse<T> {
  message: string;
  code: string;
  statusCode: number;
  errors: null | string[];
  payload: {
    list: T[];
    totalCount: number | null;
  };
}

// 에러 응답
export interface ApiError<T> {
  message: string;
  code: string;
  statusCode: number;
  errors: string[];
  payload: T;
}

export type OrderBy = 'createdAt' | 'updatedAt' | 'deletedAt';