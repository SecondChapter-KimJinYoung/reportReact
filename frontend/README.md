# 대박드림스 관리자 페이지

학원 관리 시스템을 위한 웹 기반 관리자 페이지입니다.

## 기술 스택

- **프레임워크**: React 19 + TypeScript + Vite
- **상태 관리**:
  - React Query (@tanstack/react-query) - 서버 상태 관리
  - Zustand - 전역 클라이언트 상태 관리
- **스타일링**: Tailwind CSS v4
- **UI 라이브러리**: Material-UI (MUI)
- **라우팅**: React Router DOM v7
- **HTTP 클라이언트**: Axios
- **린터**: ESLint + Prettier

## 주요 명령어

### 설치/초기화

```bash
yarn install      # 의존성 설치
```

### 개발

```bash
yarn dev          # 개발 서버 실행 (development 모드, 기본값, localhost:3000)
yarn dev:dev      # 개발 모드로 실행 (development 모드, 개발 서버 연결)
yarn dev:prod     # 프로덕션 모드로 실행 (production 모드, 실서버 연결)
yarn dev:clean    # yarn 캐시 제거 후 개발 서버 실행 (development 모드)
```

### 빌드

```bash
yarn build        # 프로덕션 빌드 (production 모드, TypeScript 체크 + Vite 빌드)
yarn build:dev    # 개발 모드 빌드 (development 모드)
yarn build:prod   # 프로덕션 모드 빌드 (production 모드, 명시적)
yarn build:clean  # yarn 캐시 제거 후 빌드
```

**환경 변수 매핑**:

| 명령어              | 모드          | 환경 변수 파일     |
| ------------------- | ------------- | ------------------ |
| `yarn dev`          | `development` | `.env.development` |
| `yarn dev:dev`      | `development` | `.env.development` |
| `yarn dev:prod`     | `production`  | `.env.production`  |
| `yarn dev:clean`    | `development` | `.env.development` |
| `yarn build`        | `production`  | `.env.production`  |
| `yarn build:dev`    | `development` | `.env.development` |
| `yarn build:prod`   | `production`  | `.env.production`  |
| `yarn preview`      | `production`  | `.env.production`  |
| `yarn preview:prod` | `production`  | `.env.production`  |

**중요**:

- `yarn dev` / `yarn dev:dev` / `yarn dev:clean` / `yarn build:dev` 모두 동일한 `.env.development` 파일을 사용합니다
- `yarn dev:prod` / `yarn build` / `yarn build:prod` / `yarn preview` / `yarn preview:prod` 모두 동일한 `.env.production` 파일을 사용합니다

### 미리보기

```bash
yarn preview      # 빌드 결과 미리보기 (production 모드, 기본 포트: 4173)
yarn preview:prod # 프로덕션 모드로 미리보기 (명시적)
```

### 코드 품질

```bash
yarn lint         # ESLint 검사
yarn lint:fix     # ESLint 자동 수정
yarn format       # Prettier 포맷팅
yarn format:check # Prettier 검사 (CI/CD용)
yarn type-check   # TypeScript 타입 체크
yarn quality      # 전체 코드 품질 검사 (type-check + lint + format:check)
yarn quality:fix  # 코드 품질 자동 수정 (lint:fix + format)
```

### 배포

```bash
yarn deploy:check # 배포 전 전체 체크 (type-check + lint + format:check + build)
yarn predeploy    # 배포 전 자동 실행 (quality + build)
```

## 빠른 시작

### 1단계: 의존성 설치

```bash
yarn install
```

### 2단계: 환경 변수 설정

#### 환경 변수 파일

- `.env.development` - 개발 환경 변수 (`yarn dev:dev` 사용 시)
- `.env.production` - 운영 환경 변수 (`yarn dev:prod` 사용 시)

#### 필수 환경 변수

**개발 서버 연결 시** (`.env.development`):

```env
VITE_API_BASE_URL=http://192.168.1.3:3001
```

**실서버 연결 시** (`.env.production`):

```env
VITE_API_BASE_URL=http://223.130.155.251:8086
```

### 3단계: 개발 서버 실행

```bash
# 개발 서버 연결
yarn dev:dev

# 실서버 연결
yarn dev:prod
```

- 포트: `http://localhost:3000`
- HMR(Hot Module Replacement) 지원
- 브라우저 자동 열림

### 4단계: 빌드 및 배포

```bash
# 프로덕션 빌드 (production 모드)
yarn build

# 빌드 결과 미리보기
yarn preview
```

**배포 전 체크리스트**:

- [ ] 환경 변수 설정 확인 (`.env.production`)
- [ ] ESLint 검사 통과 (`yarn lint`)
- [ ] Prettier 포맷팅 검사 통과 (`yarn format:check`)
- [ ] 프로덕션 빌드 성공 (`yarn build`)
- [ ] 빌드 결과 미리보기 확인 (`yarn preview`)
- [ ] 빌드된 파일에서 환경 변수 값 확인 (`dist/` 폴더)

## 서버 정보

### API 서버

- **개발 서버**: `http://192.168.1.3:3001`
- **운영 서버**: `http://223.130.155.251:8086`

### Swagger API 명세서

- **개발**: `http://192.168.1.3:3001/swagger`
- **운영**: `http://223.130.155.251:8086/api/swagger`

## 프로젝트 구조

```
src/
├── api/              # API 통신 관련
│   ├── api.ts        # API 클라이언트 (Axios 인스턴스)
│   ├── api.constants.ts  # API 상수 (BASE_URL, 엔드포인트 등)
│   ├── api.types.ts  # API 공통 타입 정의
│   ├── api.endpoints.ts  # API 엔드포인트 상수
│   └── [domain]/     # 도메인별 API (auth, academy, class 등)
│       ├── [domain].api.ts
│       └── [domain].types.ts
├── features/         # 도메인별 기능 (Feature-based)
│   └── [feature]/    # 각 기능별 폴더
│       ├── components/  # 기능 전용 컴포넌트
│       ├── hooks/       # 기능 전용 커스텀 훅
│       └── types/       # 기능 전용 타입
├── pages/            # 페이지 컴포넌트 (라우트와 1:1 매핑)
├── routes/           # 라우팅 설정
│   ├── routes.ts     # 라우트 경로 상수
│   ├── router.tsx    # 라우터 설정
│   └── menu.ts        # 메뉴 구조
└── shared/           # 공통 컴포넌트, 유틸리티
    ├── components/   # 공통 UI 컴포넌트 (Button, Input, Modal 등)
    ├── hooks/        # 공통 커스텀 훅
    ├── stores/       # 전역 Zustand 스토어
    ├── utils/        # 유틸리티 함수 (permission.ts 등)
    ├── constants/    # 공통 상수
    └── layouts/      # 레이아웃 컴포넌트
        ├── DashboardLayout.tsx    # 대시보드 메인 레이아웃
        ├── DashboardSidebar.tsx   # 대시보드 사이드바 (메뉴)
        └── DashboardHeader.tsx    # 대시보드 헤더 (프로필)
```

## 개발 규칙

### 1. 네이밍 컨벤션

| 종류              | 규칙                  | 예시                                   |
| ----------------- | --------------------- | -------------------------------------- |
| **컴포넌트**      | PascalCase.tsx        | `Button.tsx`, `AcademyList.tsx`        |
| **페이지**        | PascalCase + Page.tsx | `LoginPage.tsx`, `AcademyListPage.tsx` |
| **API**           | camelCase.api.ts      | `academy.api.ts`, `user.api.ts`        |
| **타입**          | camelCase.types.ts    | `academy.types.ts`, `common.types.ts`  |
| **Hook (단일)**   | usePascalCase.ts      | `useAuth.ts`, `useDebounce.ts`         |
| **Hook (여러개)** | camelCase.hook.ts     | `useAcademy.ts`, `useClass.ts`         |
| **Store**         | useCamelCaseStore.ts  | `useAuthStore.ts`, `useUIStore.ts`     |
| **유틸**          | camelCase.ts          | `format.ts`, `permission.ts`           |
| **상수**          | camelCase.ts          | `query-keys.ts`, `regex.ts`            |

### 2. API 타입 네이밍 규칙

```typescript
// HTTP 메서드 / 도메인명 / 요청 or 응답
export type PostAcademyRequest = { ... };
export type PostAcademyResponse = { ... };
export type GetAcademyListResponse = { ... };
export type PatchAcademyRequest = { ... };
```

### 3. 상태 관리 전략

- **React Query**: 서버 상태 (API 데이터, 캐싱, 동기화)
- **Zustand**: 클라이언트 전역 상태 (UI 상태, 사용자 설정)
- **Local State (useState)**: 컴포넌트 내부 상태

**상태 선택 가이드**:

- 서버에서 가져온 데이터 → React Query
- 여러 컴포넌트에서 공유하는 UI 상태 → Zustand
- 단일 컴포넌트 내부 상태 → useState

### 4. Feature-based 구조

- `features/` 폴더에 도메인별로 기능을 그룹화
- 각 feature는 독립적으로 관리 가능
- 예: `features/auth/`, `features/dashboard/academy/`

**Feature 폴더 구조**:

```
features/
└── dashboard/
    └── academy/
        ├── components/     # AcademyList, AcademyDetail 등
        ├── hooks/          # useAcademy.ts
        └── types/          # academy.types.ts (필요시)
```

### 5. API 통신 규칙

- 모든 API 호출은 `src/api/` 폴더에서 관리
- React Query hooks 사용 권장
- API 타입은 `[domain].types.ts`에 정의
- 엔드포인트는 `api.endpoints.ts`에 상수로 관리

**API 호출 예시**:

```typescript
// features/dashboard/academy/hooks/useAcademy.ts
import { useQuery } from '@tanstack/react-query';
import { getAcademyList } from '@/api/academy/academy.api';

export const useAcademyList = () => {
  return useQuery({
    queryKey: ['academy', 'list'],
    queryFn: getAcademyList,
  });
};
```

### 6. 컴포넌트 작성 규칙

- **재사용 가능한 컴포넌트**: `shared/components/`
- **기능 전용 컴포넌트**: `features/[feature]/components/`
- **페이지 컴포넌트**: `pages/`

컴포넌트는 최대한 작고 단일 책임을 가지도록 작성합니다.

### 7. 메뉴 접근 제어

사용자의 `accessMenu` 필드에 따라 메뉴 접근 권한이 제어됩니다.

- `accessMenu`는 JSON 문자열 배열 형태로 저장됩니다.
- 예: `["DASHBOARD", "CLASS", "CLASS_LIST", "MEMBER", "MEMBER_STUDENT_LIST"]`
- `SUPER_ADMIN` 타입의 경우 `accessMenu`가 비어있으면 모든 메뉴 접근 가능
- 1뎁스, 2뎁스, 3뎁스 메뉴 모두 권한 체크가 적용됩니다.

**권한 체크 예시**:

```typescript
// shared/utils/permission.ts
import { hasMenuAccess } from '@/shared/utils/permission';

// 메뉴 접근 권한 확인
const canAccess = hasMenuAccess('CLASS_LIST', userPermission);
```

### 8. 프로덕션 배포 주의사항

- **console.log 제거**: 프로덕션 빌드에서는 개발 모드에서만 console.log가 실행되도록 처리되어 있습니다.
- **환경 변수**: `.env.production` 파일에 운영 서버 URL을 설정해야 합니다.
- **빌드 최적화**: Vite가 자동으로 코드 스플리팅 및 최적화를 수행합니다.

## 명령어 사용 시나리오

### 일반적인 개발 워크플로우

```bash
# 1. 프로젝트 클론 후 초기 설정
yarn install

# 2. 환경 변수 설정
echo "VITE_API_BASE_URL=http://192.168.1.3:3001" > .env.development

# 3. 개발 서버 실행
yarn dev:dev

# 4. 코드 작성 후 품질 체크
yarn quality:fix   # 자동 수정 가능한 문제 해결
yarn quality      # 전체 검사
```

### 배포 워크플로우

```bash
# 1. 배포 전 전체 체크
yarn deploy:check

# 2. 프로덕션 빌드
yarn build

# 3. 빌드 결과 확인
yarn preview

# 4. dist 폴더를 서버에 업로드
```

### 문제 해결 시나리오

```bash
# 캐시 문제로 빌드가 이상할 때
yarn cache clean

# 타입 오류 확인
yarn type-check

# 린터 오류 확인 및 수정
yarn lint
yarn lint:fix
```

## 문제 해결

### 빌드 오류

- 캐시 문제가 의심되면 `yarn cache clean` 후 다시 빌드
- TypeScript 타입 오류는 `yarn type-check`로 확인

### 환경 변수 미적용

- **빌드 모드에 맞는 환경 변수 파일 확인**
  - `yarn dev:prod` / `yarn build` / `yarn build:prod` → `.env.production` 파일 사용
  - `yarn dev:dev` / `yarn build:dev` → `.env.development` 파일 사용
- 개발 서버 재시작 또는 빌드 재실행 필요
- 환경 변수는 `VITE_` 접두사가 있어야 클라이언트에서 접근 가능
