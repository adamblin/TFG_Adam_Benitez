import { Injectable } from '@nestjs/common';
import { TaskEntity } from '../domain/entities/task.entity';
import { CreateTaskDto } from '../api/dto/create-task.dto';
import { UpdateTaskDto } from '../api/dto/update-task.dto';
import { ListTasksUseCase } from './use-cases/list-tasks.use-case';
import { CreateTaskUseCase } from './use-cases/create-task.use-case';
import { UpdateTaskUseCase } from './use-cases/update-task.use-case';
import { DeleteTaskUseCase } from './use-cases/delete-task.use-case';
import { GetTaskByIdUseCase } from './use-cases/get-task-by-id.use-case';
import { BreakdownTaskUseCase } from './use-cases/breakdown-task.use-case';

/** Orquesta las operaciones CRUD de tareas y la descomposición con IA. */
@Injectable()
export class TasksService {
  constructor(
    private readonly listTasksUseCase: ListTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
    private readonly breakdownTaskUseCase: BreakdownTaskUseCase,
  ) {}

  listMyTasks(userId: string): Promise<TaskEntity[]> {
    return this.listTasksUseCase.execute(userId);
  }

  createTask(userId: string, dto: CreateTaskDto): Promise<TaskEntity> {
    return this.createTaskUseCase.execute({
      userId,
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });
  }

  updateTask(
    userId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    return this.updateTaskUseCase.execute({
      userId,
      taskId,
      title: dto.title,
      description: dto.description,
      completed: dto.completed,
      dueDate:
        dto.dueDate !== undefined
          ? dto.dueDate
            ? new Date(dto.dueDate)
            : null
          : undefined,
    });
  }

  deleteTask(userId: string, taskId: string): Promise<void> {
    return this.deleteTaskUseCase.execute(userId, taskId);
  }

  getTaskById(userId: string, taskId: string): Promise<TaskEntity> {
    return this.getTaskByIdUseCase.execute(userId, taskId);
  }

  breakdownTask(
    title: string,
  ): Promise<import('./use-cases/breakdown-task.use-case').BreakdownResult> {
    return this.breakdownTaskUseCase.execute(title);
  }
}
