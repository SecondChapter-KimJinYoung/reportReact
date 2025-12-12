import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import Button from './buttons/Button';
import { ROUTES } from '@/routes/routes';
import { useRouter } from '../hooks/useRouter';

export const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useRouter();

  let errorMessage: string;
  let errorStatus: string | number = 'Error';

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || '페이지를 찾을 수 없습니다.';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = '알 수 없는 오류가 발생했습니다.';
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-4">
          <h1 className="text-6xl font-bold text-gray-900">{errorStatus}</h1>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">오류가 발생했습니다</h2>
        <p className="mb-6 text-sm text-gray-600">{errorMessage}</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => navigate.back()} variant="white" size="sm">
            이전 페이지
          </Button>
          <Button onClick={() => navigate.push(ROUTES.HOME.ROOT)} size="sm">
            홈으로
          </Button>
        </div>
      </div>
    </div>
  );
};
