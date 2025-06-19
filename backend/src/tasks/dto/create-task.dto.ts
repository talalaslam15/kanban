import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskPriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Fix bug', description: 'Title of the task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Fix the login bug in the auth module',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '1', description: 'ID of the column' })
  @IsString()
  @IsNotEmpty()
  columnId: string;

  @ApiProperty({
    example: 1,
    description: 'Position of the task in the column',
  })
  @IsNotEmpty()
  position: number;

  @ApiProperty({
    enum: TaskPriorityEnum,
    example: TaskPriorityEnum.MEDIUM,
    description: 'Priority of the task',
    default: TaskPriorityEnum.MEDIUM,
  })
  @IsEnum(TaskPriorityEnum)
  @IsOptional()
  priority?: TaskPriorityEnum;
}
