/**
 * 라우터 설정
 *
 * React Router를 사용한 중첩 라우트 설정
 * 관리 페이지들은 DashboardLayout 하위에 중첩됩니다.
 * 페이지 컴포넌트는 lazy loading으로 코드 스플리팅을 적용합니다.
 */

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import HomeLayout from '@/shared/layouts/HomeLayout';
import { lazy } from 'react';

const TodoListPage = lazy(() => import('@/pages/todo/TodoListPage'));
const TodoCreatePage = lazy(() => import('@/pages/todo/TodoCreatePage'));
const TodoEditPage = lazy(() => import('@/pages/todo/TodoEditPage'));
const TodoDetailPage = lazy(() => import('@/pages/todo/TodoDetailPage'));

// --------------- 라우터 설정 ---------------
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <TodoListPage />,
      },
      {
        path: 'todos/create',
        element: <TodoCreatePage />,
      },
      {
        path: 'todos/:id',
        element: <TodoDetailPage />,
      },
      {
        path: 'todos/:id/edit',
        element: <TodoEditPage />,
      },
    ],
  },
]);

// 라우터 컴포넌트
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
