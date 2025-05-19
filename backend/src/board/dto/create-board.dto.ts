import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty({ example: 'Project Alpha' })
  title: string;

  @ApiProperty({ example: 'Kanban board for Alpha team', required: false })
  description?: string;

  @ApiProperty({ example: 'user-id-123' })
  ownerId: string;
}
