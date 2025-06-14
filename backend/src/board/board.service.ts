import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BoardCreateInput) {
    const owner = await this.prisma.user.findUnique({
      where: { id: data.owner.connect?.id },
    });
    const id = data.owner.connect?.id;
    if (!owner) {
      throw new BadRequestException(`User with id ${id} does not exist`);
    }

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
        columns: {
          include: {
            tasks: {
              orderBy: { position: 'asc' },
            },
          },
          orderBy: { position: 'asc' },
        },
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
