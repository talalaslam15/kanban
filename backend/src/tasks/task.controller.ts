// src/task/task.controller.ts
import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiOkResponse, ApiNotFoundResponse, ApiBody } from '@nestjs/swagger';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() data: CreateTaskDto) {
    return this.taskService.create({
      title: data.title,
      description: data.description,
      column: { connect: { id: data.columnId } },
      position: data.position,
    });
  }

  @Get()
  @ApiOkResponse({
    description: 'List of tasks',
    type: TaskResponseDto,
    isArray: true, // because this returns an array
  })
  findAll() {
    return this.taskService.findAll();
  }

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
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

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
    const task = await this.taskService.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    const updateData = {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.columnId && { column: { connect: { id: data.columnId } } }),
      ...(data.position !== undefined && { position: data.position }),
    };

    return this.taskService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Task deleted successfully' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  async remove(@Param('id') id: string) {
    const task = await this.taskService.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return this.taskService.remove(id);
  }
}
