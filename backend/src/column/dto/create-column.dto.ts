import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'To Do' })
  title: string;

  @IsInt()
  @ApiProperty({ example: 1 })
  position: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '958c729c-dccd-4a5b-980f-dc76543d6a13' })
  boardId: string;
}
