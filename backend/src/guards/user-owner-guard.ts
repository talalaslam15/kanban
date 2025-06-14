import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OwnerRequest } from 'src/auth/user.decorator';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class UserOwnerGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<OwnerRequest>();
    const userId = request.user.userId;
    const requestedUserId = request.params.id;

    // Check if the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    } // Check if user is admin
    const isAdmin = user.role === Role.admin;

    // Admin can do anything
    if (isAdmin) {
      return true;
    }

    // For non-admin users, they can only access their own user record
    if (userId !== requestedUserId) {
      throw new ForbiddenException('You can only manage your own account');
    }

    return true;
  }
}
