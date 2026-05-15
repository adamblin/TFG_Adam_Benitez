import { Module } from '@nestjs/common';
import { TaskController } from './api/task.controller';
import { TasksService } from './application/tasks.service';
import { ListTasksUseCase } from './application/use-cases/list-tasks.use-case';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from './application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from './application/use-cases/delete-task.use-case';
import { GetTaskByIdUseCase } from './application/use-cases/get-task-by-id.use-case';
import { TasksRepository } from './domain/repositories/tasks.repository';
import { PrismaTasksRepository } from './infrastructure/repositories/prisma-tasks.repository';

@Module({
  controllers: [TaskController],
  providers: [
    TasksService,
    ListTasksUseCase,
    CreateTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    GetTaskByIdUseCase,
    {
      provide: TasksRepository,
      useClass: PrismaTasksRepository,
    },
  ],
  exports: [TasksService, TasksRepository],
})
export class TasksModule {}
