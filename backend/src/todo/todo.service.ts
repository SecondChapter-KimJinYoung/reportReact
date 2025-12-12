import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetTodoListDto } from './dto/get-todo-list.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async findAll(query: GetTodoListDto) {
    const { page = 1, size = 10, keyword, orderBy = 'createdAt', sort = 'DESC' } = query;
    const skip = (page - 1) * size;

    const where: any = {};
    if (keyword) {
      where.title = Like(`%${keyword}%`);
    }

    const [list, totalCount] = await this.todoRepository.findAndCount({
      where,
      order: {
        [orderBy]: sort,
      },
      skip,
      take: size,
    });

    // tags가 null, undefined, 또는 빈 배열이면 빈 배열로 변환
    const normalizedList = list.map(todo => {
      const normalizedTodo = { ...todo };
      if (!normalizedTodo.tags || normalizedTodo.tags.length === 0) {
        normalizedTodo.tags = [];
      }
      return normalizedTodo;
    });

    return {
      message: 'Success',
      code: 'SUCCESS',
      statusCode: 200,
      errors: null,
      payload: {
        list: normalizedList,
        totalCount,
      },
    };
  }

  async findOne(id: number): Promise<any> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    const normalizedTodo = { ...todo };
    if (!normalizedTodo.tags || normalizedTodo.tags.length === 0) {
      normalizedTodo.tags = [];
    }
    
    return {
      message: 'Success',
      code: 'SUCCESS',
      statusCode: 200,
      errors: null,
      payload: normalizedTodo,
    };
  }

  async create(createTodoDto: CreateTodoDto): Promise<any> {
    const todo = this.todoRepository.create(createTodoDto);
    const saved = await this.todoRepository.save(todo);
    return {
      message: 'Success',
      code: 'SUCCESS',
      statusCode: 201,
      errors: null,
      payload: { id: saved.id },
    };
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<any> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    Object.assign(todo, updateTodoDto);
    await this.todoRepository.save(todo);
    return {
      message: 'Success',
      code: 'SUCCESS',
      statusCode: 200,
      errors: null,
      payload: { id: todo.id },
    };
  }

  async removeMany(ids: number[]): Promise<any> {
    const result = await this.todoRepository.delete(ids);
    return {
      message: 'Success',
      code: 'SUCCESS',
      statusCode: 200,
      errors: null,
      payload: { deleted: result.affected || 0 },
    };
  }

  async remove(id: number): Promise<any> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    await this.todoRepository.remove(todo);
    return {
      message: 'Success',
      code: 'SUCCESS',
      statusCode: 200,
      errors: null,
      payload: { deleted: 1 },
    };
  }
}
