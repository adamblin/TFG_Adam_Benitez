import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { StreaksRepository } from './domain/repositories/streaks.repository';
import { PrismaStreaksRepository } from './infrastructure/repositories/prisma-streaks.repository';
import { StreaksService } from './application/streaks.service';
import { StreaksController } from './api/streaks.controller';

@Module({
  imports: [PrismaModule],
  controllers: [StreaksController],
  providers: [
    { provide: StreaksRepository, useClass: PrismaStreaksRepository },
    StreaksService,
  ],
  exports: [StreaksService],
})
export class StreaksModule {}
