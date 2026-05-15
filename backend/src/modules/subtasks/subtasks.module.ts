import { Module } from '@nestjs/common';
import { TasksModule } from '../tasks/tasks.module';
import { XPModule } from '../xp/xp.module';
import { SubtaskController } from './api/subtask.controller';
import { SubtaskService } from './application/subtask.service';
import { ListSubtasksUseCase } from './application/use-cases/list-subtasks.use-case';
import { CreateSubtaskUseCase } from './application/use-cases/create-subtask.use-case';
import { GetSubtaskByIdUseCase } from './application/use-cases/get-subtask-by-id.use-case';
import { UpdateSubtaskUseCase } from './application/use-cases/update-subtask.use-case';
import { DeleteSubtaskUseCase } from './application/use-cases/delete-subtask.use-case';
import { SubtasksRepository } from './domain/repositories/subtasks.repository';
import { PrismaSubtasksRepository } from './infrastructure/repositories/prisma-subtasks.repository';

@Module({
  imports: [TasksModule, XPModule],
  controllers: [SubtaskController],
  providers: [
    SubtaskService,
    ListSubtasksUseCase,
    CreateSubtaskUseCase,
    GetSubtaskByIdUseCase,
    UpdateSubtaskUseCase,
    DeleteSubtaskUseCase,
    {
      provide: SubtasksRepository,
      useClass: PrismaSubtasksRepository,
    },
  ],
  exports: [SubtaskService],
})
export class SubtasksModule {}
