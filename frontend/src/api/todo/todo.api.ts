import { get, post, patch, del } from '@/api/api';
import { API_ENDPOINTS } from '@/api/api.endpoints';
import type {
  GetTodoListRequest,
  GetTodoListResponse,
  PostTodoRequest,
  PostTodoResponse,
  DeleteTodoResponse,
  PatchTodoRequest,
  PatchTodoResponse,
  GetTodoDetailResponse,
} from './todo.types';

export const todoApi = {
  // Todo 목록 조회
  list: (params?: GetTodoListRequest) =>
    get<GetTodoListResponse, GetTodoListRequest>(API_ENDPOINTS.TODO.LIST, params, {
      skipAuth: true,
    }),

  // Todo 등록
  create: (data: PostTodoRequest) =>
    post<PostTodoResponse, PostTodoRequest>(API_ENDPOINTS.TODO.CREATE, data, {
      skipAuth: true,
    }),

  // Todo 단일 삭제
  delete: (id: number) =>
    del<DeleteTodoResponse>(
      API_ENDPOINTS.TODO.DELETE,
      { ids: [id] },
      { skipAuth: true }
    ),

  // Todo 다중 삭제
  deleteMany: (ids: number[]) =>
    del<DeleteTodoResponse>(API_ENDPOINTS.TODO.DELETE, { ids }, { skipAuth: true }),

  // Todo 수정
  update: (id: number, data: PatchTodoRequest) =>
    patch<PatchTodoResponse, PatchTodoRequest>(
      API_ENDPOINTS.TODO.UPDATE(id),
      data,
      { skipAuth: true }
    ),

  // Todo 상세 조회
  detail: (id: number) =>
    get<GetTodoDetailResponse>(API_ENDPOINTS.TODO.DETAIL(id), undefined, {
      skipAuth: true,
    }),
};
