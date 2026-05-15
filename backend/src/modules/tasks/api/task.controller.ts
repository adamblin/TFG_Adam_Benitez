import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/api/guards/jwt-auth.guard';
import { TasksService } from '../application/tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { TaskResponseMapper } from './mappers/task-response.mapper';

type AuthenticatedRequest = Request & { user: { sub: string } };

@Controller('tasks')
@ApiTags('Tasks')
export class TaskController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List tasks for the current user' })
  @ApiOkResponse({ type: TaskResponseDto, isArray: true })
  async listMyTasks(@Req() req: AuthenticatedRequest): Promise<TaskResponseDto[]> {
    const tasks = await this.tasksService.listMyTasks(req.user.sub);
    return tasks.map((task) => TaskResponseMapper.toDto(task));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiCreatedResponse({ type: TaskResponseDto })
  async createTask(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.tasksService.createTask(req.user.sub, dto);
    return TaskResponseMapper.toDto(task);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiParam({ name: 'id', description: 'Task id' })
  @ApiOkResponse({ type: TaskResponseDto })
  async updateTask(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.tasksService.updateTask(req.user.sub, id, dto);
    return TaskResponseMapper.toDto(task);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task id' })
  @ApiNoContentResponse({ description: 'Task deleted' })
  async deleteTask(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    await this.tasksService.deleteTask(req.user.sub, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiParam({ name: 'id', description: 'Task id' })
  @ApiOkResponse({ type: TaskResponseDto })
  async getTaskById(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<TaskResponseDto> {
    const task = await this.tasksService.getTaskById(req.user.sub, id);
    return TaskResponseMapper.toDto(task);
  }
}
