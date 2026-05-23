import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/api/guards/jwt-auth.guard';
import { MotivationalPhrasesService } from '../application/motivational-phrases.service';
import type { PhraseCategory } from '../domain/entities/phrase.entity';
import { PhraseResponseDto } from './dto/phrase-response.dto';

@Controller('motivational-phrases')
@ApiTags('Motivational Phrases')
export class MotivationalPhrasesController {
  constructor(private readonly service: MotivationalPhrasesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('random')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a random motivational phrase by category' })
  @ApiQuery({ name: 'category', enum: ['TASK', 'SUBTASK', 'FOCUS'] })
  @ApiOkResponse({ type: PhraseResponseDto })
  async getRandom(
    @Query('category') category: PhraseCategory,
  ): Promise<PhraseResponseDto | null> {
    return this.service.getRandomByCategory(category);
  }
}
