import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IGetUserAuthInfoRequest } from 'src/auth/user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { SetMetadata } from '@nestjs/common';

type ResourceType = 'board' | 'column' | 'task';
export const ResourceType = (type: ResourceType) =>
  SetMetadata('resourceType', type);

type TaskOwnerRequest = IGetUserAuthInfoRequest & {
  params: {
    id: string;
  };
};

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TaskOwnerRequest>();
    const userId = request.user.userId;
    const resourceId = request.params.id;
    const resourceType = this.reflector.get<string>(
      'resourceType',
      context.getHandler(),
    );

    let resource: { ownerId: string } | null = null;
    switch (resourceType) {
      case 'board': {
        const board = await this.prisma.board.findUnique({
          where: { id: resourceId },
        });
        resource = board;
        break;
      }
      case 'column': {
        const column = await this.prisma.column.findUnique({
          where: { id: resourceId },
          include: { board: true },
        });
        resource = column?.board ?? null;
        break;
      }
      case 'task': {
        const task = await this.prisma.task.findUnique({
          where: { id: resourceId },
          include: { column: { include: { board: true } } },
        });
        resource = task?.column?.board ?? null;
        break;
      }
      default:
        throw new ForbiddenException('Unknown resource type');
    }

    if (!resource) {
      throw new NotFoundException(`${resourceType} not found`);
    }

    if (resource.ownerId !== userId) {
      throw new ForbiddenException(`You do not own this ${resourceType}`);
    }
    return true;
  }
}
