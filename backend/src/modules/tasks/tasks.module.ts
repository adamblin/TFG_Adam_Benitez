import { Module } from '@nestjs/common';
import { TasksService } from './api/tasks.service';
import { TasksController } from './api/tasks.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
