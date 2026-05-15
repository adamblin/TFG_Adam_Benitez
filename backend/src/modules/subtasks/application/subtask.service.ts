import { Injectable } from '@nestjs/common';
import { SubtaskEntity } from '../domain/entities/subtask.entity';
import { CreateSubtaskDto } from '../api/dto/create-subtask.dto';
import { UpdateSubtaskDto } from '../api/dto/update-subtask.dto';
import { ListSubtasksUseCase } from './use-cases/list-subtasks.use-case';
import { CreateSubtaskUseCase } from './use-cases/create-subtask.use-case';
import { GetSubtaskByIdUseCase } from './use-cases/get-subtask-by-id.use-case';
import { UpdateSubtaskUseCase } from './use-cases/update-subtask.use-case';
import { DeleteSubtaskUseCase } from './use-cases/delete-subtask.use-case';

@Injectable()
export class SubtaskService {
  constructor(
    private readonly listSubtasksUseCase: ListSubtasksUseCase,
    private readonly createSubtaskUseCase: CreateSubtaskUseCase,
    private readonly getSubtaskByIdUseCase: GetSubtaskByIdUseCase,
    private readonly updateSubtaskUseCase: UpdateSubtaskUseCase,
    private readonly deleteSubtaskUseCase: DeleteSubtaskUseCase,
  ) {}

  listByTask(userId: string, taskId: string): Promise<SubtaskEntity[]> {
    return this.listSubtasksUseCase.execute(userId, taskId);
  }

  createSubtask(userId: string, dto: CreateSubtaskDto): Promise<SubtaskEntity> {
    return this.createSubtaskUseCase.execute({
      userId,
      taskId: dto.taskId,
      title: dto.title,
      order: dto.order,
    });
  }

  getSubtaskById(userId: string, subtaskId: string): Promise<SubtaskEntity> {
    return this.getSubtaskByIdUseCase.execute(userId, subtaskId);
  }

  updateSubtask(userId: string, subtaskId: string, dto: UpdateSubtaskDto): Promise<SubtaskEntity> {
    return this.updateSubtaskUseCase.execute({
      userId,
      subtaskId,
      title: dto.title,
      completed: dto.completed,
      order: dto.order,
    });
  }

  deleteSubtask(userId: string, subtaskId: string): Promise<void> {
    return this.deleteSubtaskUseCase.execute(userId, subtaskId);
  }
}
