import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/api/guards/jwt-auth.guard';
import { StreaksService } from '../application/streaks.service';

export class StreakResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() userId!: string;
  @ApiProperty() currentStreak!: number;
  @ApiProperty() longestStreak!: number;
  @ApiPropertyOptional({ nullable: true }) lastActiveDate!: string | null;
  @ApiProperty() createdAt!: string;
  @ApiProperty() updatedAt!: string;
}

type AuthRequest = Request & { user: { sub: string } };

@Controller('streaks')
@ApiTags('Streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get streak data for the current user' })
  @ApiOkResponse({ type: StreakResponseDto })
  async getMyStreak(@Req() req: AuthRequest): Promise<StreakResponseDto> {
    const streak = await this.streaksService.getStreak(req.user.sub);
    if (!streak) {
      const now = new Date().toISOString();
      return {
        id: '',
        userId: req.user.sub,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        createdAt: now,
        updatedAt: now,
      };
    }
    return {
      id: streak.id,
      userId: streak.userId,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActiveDate: streak.lastActiveDate?.toISOString() ?? null,
      createdAt: streak.createdAt.toISOString(),
      updatedAt: streak.updatedAt.toISOString(),
    };
  }
}
