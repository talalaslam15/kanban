import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
  }
  async findAll(userId?: string) {
    // Check if the user is admin
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      // If the user is admin, return all users
      if (user && user.role === 'admin') {
        return this.prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            password: false,
            createdAt: true,
            updatedAt: true,
          },
        });
      }

      // If not admin, return only the current user
      return this.prisma.user.findMany({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          password: false,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    // Default behavior (no userId provided)
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    if (data.email && typeof data.email === 'string') {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('User with this email already exists');
      }
    }
    let hashedPassword: string | undefined;
    if (data.password && typeof data.password === 'string') {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        ...(hashedPassword ? { password: hashedPassword } : {}),
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
