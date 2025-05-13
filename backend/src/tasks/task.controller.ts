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
} from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { TaskResponseDto } from './dto/task-response.dto';

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
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data) {
    return this.taskService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
