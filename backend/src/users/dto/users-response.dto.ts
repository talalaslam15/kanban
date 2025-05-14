import { ApiProperty } from '@nestjs/swagger';

export class UsersResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'example@mail.com' })
  email: string;

  @ApiProperty({ example: '2025-05-13T08:45:23.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-13T08:45:23.000Z' })
  updatedAt: Date;
}
