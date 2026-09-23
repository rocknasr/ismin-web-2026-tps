import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { type Task, TASKS } from '../model.js';

/**
 * Given. `downloads` is not here on purpose: a download count is measured
 * by the system, never posted by a client.
 *
 * These decorators run at runtime, unlike TypeScript types which are erased
 * at compile time. This is what actually protects the service from whatever
 * arrives over the network.
 */
export class CreateModelDto {
  @IsString()
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: 'id must be a lowercase slug, e.g. "mistral-7b-instruct-v0-3"',
  })
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  org!: string;

  @IsIn(TASKS)
  task!: Task;

  @IsNumber()
  @Min(0)
  parameters!: number;

  @IsOptional()
  @IsString()
  license?: string;
}
