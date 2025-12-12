/**
 * App 컴포넌트
 *
 * 애플리케이션의 최상위 컴포넌트입니다.
 * 전역 Provider들과 라우터를 설정합니다.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from '@/routes/router';
import Toast from '@/shared/components/Toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toast />
    </QueryClientProvider>
  );
};

export default App;
