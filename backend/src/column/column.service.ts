import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ColumnService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ColumnCreateInput) {
    return this.prisma.column.create({ data });
  }

  findAll(userId: string) {
    return this.prisma.column.findMany({
      where: {
        board: {
          ownerId: userId,
        },
      },
      include: {
        tasks: {
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { position: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.column.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: { title?: string; position?: number; boardId?: string },
    userId: string,
  ) {
    if (data.boardId) {
      const board = await this.prisma.board.findUnique({
        where: { id: data.boardId },
      });
      if (!board) {
        throw new NotFoundException(`Board with id ${data.boardId} not found`);
      }
      if (board.ownerId !== userId) {
        throw new ForbiddenException(
          `You do not have access to board with id ${data.boardId}`,
        );
      }
    }
    return this.prisma.column.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.column.delete({ where: { id } });
  }
}
