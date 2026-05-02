import { Module } from '@nestjs/common';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { UsersRepository } from './domain/repositories/users.repository';
import { PrismaUsersRepository } from './infrastructure/repositories';

@Module({
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