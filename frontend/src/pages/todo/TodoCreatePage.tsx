import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '@/api/todo/todo.api';
import { useRouter } from '@/shared/hooks/useRouter';
import { ROUTES } from '@/routes/routes';
import Button from '@/shared/components/buttons/Button';

const TodoCreatePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const createMutation = useMutation({
    mutationFn: todoApi.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      const todoId = response.payload?.id;
      if (todoId) {
        router.push(ROUTES.TODO.DETAIL(todoId));
      } else {
        router.push(ROUTES.TODO.LIST);
      }
    },
  });

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    createMutation.mutate({
      title: title.trim(),
      content: content,
      completed: false,
      tags: tags.length > 0 ? tags : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* 제목 입력 */}
        <input
          type="text"
          placeholder="제목을 입력하세요..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-6 w-full border-0 bg-transparent text-4xl font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />

        {/* 텍스트 에디터 */}
        <div className="mb-6">
          <label className="mb-2 block text-base font-semibold text-gray-900">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요..."
            className="min-h-[500px] w-full rounded-lg border border-gray-300 p-4 text-sm leading-relaxed text-gray-700 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
          />
        </div>

        {/* 태그 입력 */}
        <div className="mb-6">
          <label className="mb-2 block text-base font-semibold text-gray-900">태그</label>
          <div className="flex flex-wrap gap-2 rounded-lg border border-gray-300 p-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-green-700 hover:text-green-900"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="태그 입력 후 Enter..."
              className="flex-1 border-0 bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-3 border-gray-200 pt-6">
          <Button variant="white" size="md" onClick={() => router.back()}>
            취소
          </Button>
          <Button variant="white" size="md" onClick={handleSave}>
            임시저장
          </Button>
          <Button
            variant="black"
            size="md"
            onClick={handleSave}
            isLoading={createMutation.isPending}
          >
            발행
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodoCreatePage;

