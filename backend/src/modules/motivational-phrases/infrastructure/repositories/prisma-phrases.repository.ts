import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  PhraseCategory,
  PhraseEntity,
} from '../../domain/entities/phrase.entity';
import { PhrasesRepository } from '../../domain/repositories/phrases.repository';

@Injectable()
export class PrismaPhrasesRepository implements PhrasesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRandomByCategory(
    category: PhraseCategory,
  ): Promise<PhraseEntity | null> {
    const count = await this.prisma.motivationalPhrase.count({
      where: { category },
    });
    if (!count) return null;
    const skip = Math.floor(Math.random() * count);
    const results = await this.prisma.motivationalPhrase.findMany({
      where: { category },
      skip,
      take: 1,
    });
    return results[0] ?? null;
  }
}
