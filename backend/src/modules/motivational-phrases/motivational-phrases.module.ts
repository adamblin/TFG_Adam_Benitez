import { Module } from '@nestjs/common';
import { MotivationalPhrasesController } from './api/motivational-phrases.controller';
import { MotivationalPhrasesService } from './application/motivational-phrases.service';
import { GetRandomPhraseUseCase } from './application/use-cases/get-random-phrase.use-case';
import { PhrasesRepository } from './domain/repositories/phrases.repository';
import { PrismaPhrasesRepository } from './infrastructure/repositories/prisma-phrases.repository';

@Module({
  controllers: [MotivationalPhrasesController],
  providers: [
    MotivationalPhrasesService,
    GetRandomPhraseUseCase,
    {
      provide: PhrasesRepository,
      useClass: PrismaPhrasesRepository,
    },
  ],
  exports: [MotivationalPhrasesService],
})
export class MotivationalPhrasesModule {}
