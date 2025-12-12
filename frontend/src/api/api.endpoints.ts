/**
 * API 엔드포인트 상수
 *
 * 모든 API URL을 중앙에서 관리합니다.
 * BASE_URL은 환경변수 `VITE_API_BASE_URL` 에서 관리됩니다.
 *
 * 각 엔드포인트는 다음과 같은 형태를 가집니다.
 * LIST: 목록 조회 (GET)
 * DETAIL: 상세 조회 (GET)
 * CREATE: 생성 (POST)
 * UPDATE: 수정 (PATCH)
 * DELETE: 삭제 (DELETE)
 */

const HEALTH_CHECK_PATH = '/api/health';

export const API_ENDPOINTS = {
  // ============ 상태 체크 ============
  STATUS: {
    CHECK: HEALTH_CHECK_PATH,
  },

  AUTH: {
    FIND_ACCOUNT: `/auth/manager/find/account`,
    FIND_PASSWORD: `/auth/manager/find/password`,
    LOGIN: `/auth/manager/login`,
    RESET_PASSWORD: `/auth/manager/reset/password`,
    REFRESH: `/auth/manager/reset/token`,
    SIGNUP: `/auth/manager/sign`,
    VERIFICATION_SEND: `/auth/verification/send`,
  },

  // ============ Todo =================
  TODO: {
    LIST: `/todos`, // 목록조회
    CREATE: `/todos`, // 생성
    DELETE: `/todos`, // 삭제
    UPDATE: (id: number) => `/todos/${id}`, // 수정
    DETAIL: (id: number) => `/todos/${id}`, // 단일조회
  },
} as const;
