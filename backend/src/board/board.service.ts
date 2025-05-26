import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.BoardCreateInput) {
    return this.prisma.board.create({ data });
  }

  findAll(userId: string) {
    return this.prisma.board.findMany({
      where: { ownerId: userId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        // columns: { include: { tasks: false } },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.board.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.BoardUpdateInput) {
    return this.prisma.board.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.board.delete({ where: { id } });
  }
}
