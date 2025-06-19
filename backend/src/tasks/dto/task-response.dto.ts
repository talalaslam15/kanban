import { ApiProperty } from '@nestjs/swagger';
import { TaskPriorityEnum } from './create-task.dto';

export class TaskResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Fix login bug' })
  title: string;

  @ApiProperty({ example: 'Users cannot log in with Google.' })
  description?: string;

  @ApiProperty({
    enum: TaskPriorityEnum,
    example: TaskPriorityEnum.MEDIUM,
    description: 'Priority of the task',
  })
  priority: TaskPriorityEnum;

  @ApiProperty({ example: '2025-05-13T08:45:23.000Z' })
  createdAt: Date;
}
