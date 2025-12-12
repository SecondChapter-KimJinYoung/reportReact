import { IsArray, IsNumber, ArrayMinSize } from 'class-validator';

export class DeleteTodoDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  ids: number[];
}

