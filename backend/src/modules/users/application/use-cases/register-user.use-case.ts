import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserInput } from '../inputs/register-user.input';
import { RegisterUserResponse } from '../types/register-user-response.type';
import { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserResponse> {
    const email = input.email.trim().toLowerCase();
    const username = input.username.trim();

    const existingUserByEmail = await this.usersRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already in use');
    }

    const existingUserByUsername =
      await this.usersRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new ConflictException('Username already in use');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.usersRepository.create({
      email,
      username,
      passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
