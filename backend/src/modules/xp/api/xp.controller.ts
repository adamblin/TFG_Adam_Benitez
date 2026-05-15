import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/api/guards/jwt-auth.guard';
import { XPService } from '../application/xp.service';

export class LevelInfoDto {
  @ApiProperty() totalXp!: number;
  @ApiProperty() level!: number;
  @ApiProperty() xpInLevel!: number;
  @ApiProperty() xpToNextLevel!: number;
  @ApiProperty() progressPercent!: number;
  @ApiProperty() coins!: number;
}

type AuthRequest = Request & { user: { sub: string } };

@Controller('xp')
@ApiTags('XP')
export class XPController {
  constructor(private readonly xpService: XPService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get XP and level info for the current user' })
  @ApiOkResponse({ type: LevelInfoDto })
  async getMyXP(@Req() req: AuthRequest): Promise<LevelInfoDto> {
    return this.xpService.getLevelInfo(req.user.sub);
  }
}
