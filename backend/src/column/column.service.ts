import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ColumnService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ColumnCreateInput) {
    return this.prisma.column.create({ data });
  }

  findAll() {
    return this.prisma.column.findMany();
  }

  findOne(id: string) {
    return this.prisma.column.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.ColumnUpdateInput) {
    return this.prisma.column.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.column.delete({ where: { id } });
  }
}
