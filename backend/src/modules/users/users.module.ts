import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { UsersRepository } from './domain/repositories/users.repository';
import { PrismaUsersRepository } from './infrastructure/repositories';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [RegisterUserUseCase, UsersRepository],
})
export class UsersModule {}
