import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '@/api/todo/todo.api';
import { useRouter } from '@/shared/hooks/useRouter';
import { ROUTES } from '@/routes/routes';
import Button from '@/shared/components/buttons/Button';
import { ICONS } from '@/shared/components/icons';
import { formatRelativeTime } from '@/shared/utils/date';

const TodoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const EditIcon = ICONS.Edit;
  const DeleteIcon = ICONS.Delete;
  const CheckIcon = ICONS.CheckCircle;

  const { data, isLoading } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => todoApi.detail(Number(id)),
    enabled: !!id,
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: (completed: boolean) => todoApi.update(Number(id!), { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => todoApi.delete(Number(id!)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      router.push(ROUTES.TODO.LIST);
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  const todo = data?.payload;
  if (!todo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Todo를 찾을 수 없습니다.</p>
          <Button variant="black" size="md" onClick={() => router.push(ROUTES.TODO.LIST)}>
            목록으로
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* 상단 액션 버튼 */}
        <div className="mb-6 flex justify-end gap-2">
          <Button
            variant={todo.completed ? 'white' : 'black'}
            size="sm"
            leftIcon={<CheckIcon />}
            onClick={() => toggleCompleteMutation.mutate(!todo.completed)}
            isLoading={toggleCompleteMutation.isPending}
          >
            {todo.completed ? '완료 취소' : '완료'}
          </Button>
          <Button
            variant="white"
            size="sm"
            leftIcon={<EditIcon />}
            onClick={() => router.push(ROUTES.TODO.EDIT(todo.id))}
          >
            수정
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<DeleteIcon />}
            onClick={() => {
              if (window.confirm('정말 삭제하시겠습니까?')) {
                deleteMutation.mutate();
              }
            }}
          >
            삭제
          </Button>
        </div>

        {/* 제목 */}
        <h1 className="mb-4 text-4xl font-bold text-gray-900">{todo.title}</h1>

        {/* 메타 정보 */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span>{formatRelativeTime(todo.createdAt)}</span>
          {todo.completed && (
            <span className="flex items-center gap-1 text-green-600">
              <CheckIcon className="h-4 w-4" />
              완료됨
            </span>
          )}
        </div>

        {/* 태그 */}
        {todo.tags && todo.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {todo.tags.map(tag => (
              <span
                key={tag}
                className="rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 본문 */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8 prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap">{todo.content || '내용이 없습니다.'}</div>
        </div>
      </div>
    </div>
  );
};

export default TodoDetailPage;
