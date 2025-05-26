// src/task/task.service.ts

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateInput, userId: string) {
    // Step 1: Fetch the column and board info
    const column = await this.prisma.column.findUnique({
      where: { id: data.column.connect?.id },
      include: { board: true },
    });

    if (!column) {
      throw new ForbiddenException('Column not found');
    }

    // Step 2: Check if the board belongs to the logged-in user
    if (column.board.ownerId !== userId) {
      throw new ForbiddenException('You do not own this board');
    }

    return this.prisma.task.create({ data });
  }

  findAll() {
    return this.prisma.task.findMany();
  }

  findOne(id: string) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.TaskUpdateInput) {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
