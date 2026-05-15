import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { UserXPRepository } from './domain/repositories/user-xp.repository';
import { PrismaUserXPRepository } from './infrastructure/repositories/prisma-user-xp.repository';
import { XPService } from './application/xp.service';
import { XPController } from './api/xp.controller';

@Module({
  imports: [PrismaModule],
  controllers: [XPController],
  providers: [
    { provide: UserXPRepository, useClass: PrismaUserXPRepository },
    XPService,
  ],
  exports: [XPService],
})
export class XPModule {}
