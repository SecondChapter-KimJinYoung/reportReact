import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * React Router 네비게이션 헬퍼 훅
 *
 * useNavigate를 더 직관적인 메서드로 래핑합니다.
 *
 * @example
 * const router = useRouter();
 * router.push('/dashboard');  // 페이지 이동
 * router.back();               // 뒤로가기
 * router.replace('/login');    // 히스토리 대체
 */
export const useRouter = () => {
  const navigate = useNavigate();

  const router = useMemo(
    () => ({
      back: () => navigate(-1),
      forward: () => navigate(1),
      reload: () => window.location.reload(),
      push: (href: string) => navigate(href),
      replace: (href: string) => navigate(href, { replace: true }),
    }),
    [navigate]
  );

  return router;
};
