import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { TaskEntity } from './tasks.service';

export interface CreateTaskDto {
  title: string;
}

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAll(): Promise<TaskEntity[]> {
    return this.tasksService.getAll();
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
  ): Promise<TaskEntity | { error: string }> {
    const task = await this.tasksService.getById(id);
    if (!task) {
      return { error: 'Task not found' };
    }
    return task;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() body: CreateTaskDto): Promise<TaskEntity> {
    return this.tasksService.create(body.title);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<TaskEntity>,
  ): Promise<TaskEntity | { error: string }> {
    const updated = await this.tasksService.update(id, body);
    if (!updated) {
      return { error: 'Task not found' };
    }
    return updated;
  }
}
