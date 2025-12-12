import type { ApiResponse, ListResponse, OrderBy } from '../api.types';

// --------- Entities ---------
export interface TodoItem {
  id: number;
  title: string;
  image?: string;
  content: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// --------- Requests ---------
export interface GetTodoListRequest {
  page?: number;
  size?: number;
  sort?: string;
  orderBy?: OrderBy;
  keyword?: string;
}

export interface PostTodoRequest {
  title: string;
  image?: string;
  content: string;
  completed?: boolean;
  tags?: string[];
}

export type DeleteTodoRequest = { ids: number[] };

export interface PatchTodoRequest {
  title?: string;
  image?: string;
  content?: string;
  completed?: boolean;
  tags?: string[];
}

// --------- Responses ---------
export type GetTodoListResponse = ListResponse<TodoItem>;
export type PostTodoResponse = ApiResponse<{ id: number }>;
export type DeleteTodoResponse = ApiResponse<{ deleted: number }>;
export type PatchTodoResponse = ApiResponse<{ id: number }>;
export type GetTodoDetailResponse = ApiResponse<TodoItem>;
