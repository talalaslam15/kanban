import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { IGetUserAuthInfoRequest } from 'src/auth/user.decorator';

type TaskOwnerRequest = IGetUserAuthInfoRequest & {
  params: {
    id: string;
  };
};

@Injectable()
export class TaskOwnerGuard implements CanActivate {
  constructor(private readonly taskService: TaskService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TaskOwnerRequest>();
    const userId = request.user.userId;
    const taskId = request.params.id;
    const task = await this.taskService.findOne(taskId);

    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    if (task.column.board.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this task',
      );
    }
    return true;
  }
}
