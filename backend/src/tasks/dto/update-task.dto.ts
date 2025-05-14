import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';
// import { PartialType } from '@nestjs/mapped-types';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({ description: 'Task title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Task description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Column ID to move the task to',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  columnId?: string;

  @ApiProperty({ description: 'Task position in the column', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  position?: number;
}
