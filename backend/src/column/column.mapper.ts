import { CreateColumnDto } from './dto/create-column.dto';
import { Prisma } from '@prisma/client';

export function mapCreateColumnDtoToPrisma(
  data: CreateColumnDto,
): Prisma.ColumnCreateInput {
  return {
    title: data.title,
    position: data.position,
    board: {
      connect: { id: data.boardId },
    },
  };
}
