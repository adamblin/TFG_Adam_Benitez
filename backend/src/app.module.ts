import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { SubtasksModule } from './modules/subtasks/subtasks.module';
import { FocusSessionsModule } from './modules/focus-sessions/focus-sessions.module';
import { StreaksModule } from './modules/streaks/streaks.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { XPModule } from './modules/xp/xp.module';
import { ShopModule } from './modules/shop/shop.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    AuthModule,
    TasksModule,
    SubtasksModule,
    FocusSessionsModule,
    StreaksModule,
    NotificationsModule,
    XPModule,
    ShopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
