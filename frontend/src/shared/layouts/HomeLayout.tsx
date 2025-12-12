import { Suspense, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

interface HomeLayoutProps {
  children?: ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="font-pretendard">
      <Header />
      
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" /></div>}>
        {children || <Outlet />}
      </Suspense>
    </div>
  );
};

export default HomeLayout;
