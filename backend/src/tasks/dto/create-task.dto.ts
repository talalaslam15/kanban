import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'todo', required: false })
  @IsString()
  @IsOptional()
  status?: string;

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
  // Add any other properties you need for the task creation
}
