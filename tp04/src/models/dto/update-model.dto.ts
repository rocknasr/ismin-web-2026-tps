import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { type Task, TASKS } from '../model.js';

/** Given. A partial update: every field is optional, `id`, `org` and `downloads` cannot change. */
export class UpdateModelDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsIn(TASKS)
  task?: Task;

  @IsOptional()
  @IsNumber()
  @Min(0)
  parameters?: number;

  @IsOptional()
  @IsString()
  license?: string;
}
