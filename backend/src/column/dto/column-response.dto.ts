import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ColumnResponseDto {
  @Expose()
  @ApiProperty({ example: '958c729c-dccd-4a5b-980f-dc76543d6a13' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'To Do' })
  title: string;

  @Expose()
  @ApiProperty({ example: 1 })
  position: number;

  @Expose()
  @ApiProperty({ example: '958c729c-dccd-4a5b-980f-dc76543d6a13' })
  boardId: string;

  @Expose()
  @ApiProperty({ example: '2025-05-13T08:45:23.000Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2025-05-13T08:45:23.000Z' })
  updatedAt: Date;
}
