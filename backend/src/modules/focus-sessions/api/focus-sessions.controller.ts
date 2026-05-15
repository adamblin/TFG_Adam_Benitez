import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/api/guards/jwt-auth.guard';
import { FocusSessionsService } from '../application/focus-sessions.service';
import { StartSessionDto } from './dto/start-session.dto';
import { EndSessionDto } from './dto/end-session.dto';
import { SessionResponseDto, EndSessionResponseDto } from './dto/session-response.dto';
import { SessionResponseMapper } from './mappers/session-response.mapper';

type AuthRequest = Request & { user: { sub: string } };

@Controller('focus')
@ApiTags('Focus')
export class FocusSessionsController {
  constructor(private readonly service: FocusSessionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('start')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start a new focus session' })
  @ApiCreatedResponse({ type: SessionResponseDto })
  async start(@Req() req: AuthRequest, @Body() dto: StartSessionDto): Promise<SessionResponseDto> {
    const session = await this.service.startSession(req.user.sub, dto);
    return SessionResponseMapper.toDto(session);
  }

  @UseGuards(JwtAuthGuard)
  @Post('end')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'End an active focus session' })
  @ApiOkResponse({ type: EndSessionResponseDto })
  async end(@Req() req: AuthRequest, @Body() dto: EndSessionDto): Promise<EndSessionResponseDto> {
    const { session, message } = await this.service.endSession(req.user.sub, dto);
    return { session: SessionResponseMapper.toDto(session), message };
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all focus sessions for the current user' })
  @ApiOkResponse({ type: SessionResponseDto, isArray: true })
  async listSessions(@Req() req: AuthRequest): Promise<SessionResponseDto[]> {
    const sessions = await this.service.listSessions(req.user.sub);
    return sessions.map(SessionResponseMapper.toDto);
  }
}
