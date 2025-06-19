import { CreateTaskDto } from './dto/create-task.dto';

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IGetUserAuthInfoRequest } from 'src/auth/user.decorator';
import { OwnerGuard, ResourceType } from 'src/guards/owner-guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Post()
  create(@Body() data: CreateTaskDto, @Req() req: IGetUserAuthInfoRequest) {
    const userId = req.user.userId;
    const payload = {
      title: data.title,
      description: data.description,
      column: { connect: { id: data.columnId } },
      position: data.position,
      priority: data.priority,
    };

    return this.taskService.create(payload, userId);
  }

  @Get()
  @ApiOkResponse({
    description: 'List of tasks',
    type: TaskResponseDto,
    isArray: true, // because this returns an array
  })
  findAll(@Req() req: IGetUserAuthInfoRequest) {
    return this.taskService.findAll(req.user.userId);
  }

  @UseGuards(OwnerGuard)
  @ResourceType('task')
  @Get(':id')
  @ApiOkResponse({
    description: 'Task found',
    type: TaskResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
  })
  async findOne(@Param('id') id: string) {
    const task = await this.taskService.findOne(id);
    return task;
  }
  @UseGuards(OwnerGuard)
  @ResourceType('task')
  @Patch(':id')
  @ApiOkResponse({
    description: 'Task updated',
    type: TaskResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
  })
  @ApiBody({ type: UpdateTaskDto, description: 'Task data to update' })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) data: UpdateTaskDto,
  ) {
    const updateData = {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.columnId && { column: { connect: { id: data.columnId } } }),
      ...(data.position !== undefined && { position: data.position }),
      ...(data.priority !== undefined && { priority: data.priority }),
    };

    return this.taskService.update(id, updateData);
  }

  @UseGuards(OwnerGuard)
  @ResourceType('task')
  @Delete(':id')
  @ApiOkResponse({ description: 'Task deleted successfully' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  async remove(@Param('id') id: string) {
    await this.taskService.remove(id);
    return { message: 'Task deleted successfully' };
  }
}
