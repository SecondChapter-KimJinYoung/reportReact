import Button from '@/shared/components/buttons/Button';
import { ICONS } from '@/shared/components/icons';
import { useRouter } from '@/shared/hooks/useRouter';
import { ROUTES } from '@/routes/routes';

export const Header = () => {
  const PlusIcon = ICONS.Plus;
  const router = useRouter();

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* 좌측 로고 */}
        <div className="flex items-center">
          <h1
            className="cursor-pointer text-2xl font-bold text-gray-900 transition-opacity hover:opacity-80"
            onClick={() => router.push(ROUTES.HOME.ROOT)}
          >
            Report
          </h1>
        </div>

        {/* 우측 글작성 버튼 */}
          <Button
            variant="black"
            size="xs"
            leftIcon={<PlusIcon />}
            onClick={() => router.push('/todos/create')}
          >
            글작성
          </Button>
      </div>
    </header>
  );
};
