import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { todoApi } from '@/api/todo/todo.api';
import type { TodoItem } from '@/api/todo/todo.types';
import { useRouter } from '@/shared/hooks/useRouter';
import { ROUTES } from '@/routes/routes';
import Button from '@/shared/components/buttons/Button';
import { ICONS } from '@/shared/components/icons';
import { formatRelativeTime } from '@/shared/utils/date';

type FilterType = 'all' | 'active' | 'completed';

const TodoListPage = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['todos', filter, searchKeyword],
    queryFn: () =>
      todoApi.list({
        page: 1,
        size: 100,
        keyword: searchKeyword || undefined,
        orderBy: 'createdAt',
        sort: 'DESC',
      }),
  });

  const todos = data?.payload?.list || [];
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 필터/정렬/검색 영역 */}
        <div className="mb-8 space-y-4">
          {/* 필터 탭 */}
          <div className="flex gap-2">
            {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'black' : 'white'}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? '전체' : f === 'active' ? '진행중' : '완료'}
              </Button>
            ))}
          </div>

          {/* 검색바 */}
          <div className="relative">
            <input
              type="text"
              placeholder="제목, 내용, 태그로 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-gray-900 focus:outline-none"
            />
            <ICONS.Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* 카드 그리드 - 가로 4개 */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="py-12 text-center text-gray-500">Todo가 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTodos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TodoCard = ({ todo }: { todo: TodoItem }) => {
  const router = useRouter();
  const CheckIcon = ICONS.CheckCircle;

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg ${
        todo.completed ? 'opacity-70' : ''
      }`}
      onClick={() => router.push(ROUTES.TODO.DETAIL(todo.id))}
    >
      {/* 완료 오버레이 */}
      {todo.completed && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <CheckIcon className="h-16 w-16 text-green-500" />
        </div>
      )}

      {/* 상단 배너 */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        {todo.image ? (
          <img
            src={todo.image}
            alt={todo.title}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              todo.completed ? 'opacity-50' : 'group-hover:opacity-90'
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <svg
              className="h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* 본문 영역 */}
      <div className="p-6">
        {/* 제목 */}
        <h3 className="mb-3 text-xl font-bold text-gray-900">{todo.title}</h3>

        {/* 본문 미리보기 */}
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
          {todo.content || '내용이 없습니다.'}
        </p>

        {/* 태그 */}
        {todo.tags && todo.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {todo.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 메타데이터 */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{formatRelativeTime(todo.createdAt)}</span>
          <span>·</span>
          <span>0개의 댓글</span>
        </div>
      </div>
    </div>
  );
};

export default TodoListPage;

