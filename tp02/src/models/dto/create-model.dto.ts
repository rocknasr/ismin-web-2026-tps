import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import type { Task } from '../model.js';

/** The four values `Task` allows, as a runtime list `class-validator` can check against. */
export const TASKS: Task[] = [
  'text-generation',
  'translation',
  'image-classification',
  'speech-to-text',
];

export class CreateModelDto {
  @IsString()
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: 'id must be a slug (lowercase letters, digits, hyphens)',
  })
  id!: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  org!: string;

  @IsIn(TASKS)
  task!: Task;

  @IsNumber()
  @IsPositive()
  parameters!: number;

  @IsInt()
  @Min(0)
  downloads!: number;

  @IsOptional()
  @IsString()
  license?: string;
}
