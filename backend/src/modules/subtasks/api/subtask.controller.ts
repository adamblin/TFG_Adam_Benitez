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
import { SubtaskService } from '../application/subtask.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { SubtaskResponseDto } from './dto/subtask-response.dto';
import { SubtaskResponseMapper } from './mappers/subtask-response.mapper';

type AuthenticatedRequest = Request & { user: { sub: string } };

@Controller('subtasks')
@ApiTags('Subtasks')
export class SubtaskController {
  constructor(private readonly subtaskService: SubtaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new subtask for a task' })
  @ApiCreatedResponse({ type: SubtaskResponseDto })
  async createSubtask(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateSubtaskDto,
  ): Promise<SubtaskResponseDto> {
    const subtask = await this.subtaskService.createSubtask(req.user.sub, dto);
    return SubtaskResponseMapper.toDto(subtask);
  }

  @UseGuards(JwtAuthGuard)
  @Get('task/:taskId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List subtasks for a task' })
  @ApiParam({ name: 'taskId', description: 'Parent task id' })
  @ApiOkResponse({ type: SubtaskResponseDto, isArray: true })
  async listByTask(
    @Req() req: AuthenticatedRequest,
    @Param('taskId') taskId: string,
  ): Promise<SubtaskResponseDto[]> {
    const subtasks = await this.subtaskService.listByTask(req.user.sub, taskId);
    return subtasks.map((s) => SubtaskResponseMapper.toDto(s));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a subtask by id' })
  @ApiParam({ name: 'id', description: 'Subtask id' })
  @ApiOkResponse({ type: SubtaskResponseDto })
  async getSubtaskById(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<SubtaskResponseDto> {
    const subtask = await this.subtaskService.getSubtaskById(req.user.sub, id);
    return SubtaskResponseMapper.toDto(subtask);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a subtask' })
  @ApiParam({ name: 'id', description: 'Subtask id' })
  @ApiOkResponse({ type: SubtaskResponseDto })
  async updateSubtask(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateSubtaskDto,
  ): Promise<SubtaskResponseDto> {
    const subtask = await this.subtaskService.updateSubtask(req.user.sub, id, dto);
    return SubtaskResponseMapper.toDto(subtask);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a subtask' })
  @ApiParam({ name: 'id', description: 'Subtask id' })
  @ApiNoContentResponse({ description: 'Subtask deleted' })
  async deleteSubtask(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    await this.subtaskService.deleteSubtask(req.user.sub, id);
  }
}
