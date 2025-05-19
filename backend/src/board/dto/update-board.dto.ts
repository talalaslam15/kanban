import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBoardDto {
  @ApiPropertyOptional({ example: 'Project Beta' })
  title?: string;

  @ApiPropertyOptional({ example: 'Updated board description' })
  description?: string;
}
