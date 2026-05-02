import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../../users/domain/repositories/users.repository';
import { LoginUserInput } from '../inputs/login-user.input';
import { LoginResponse } from '../types/login-response.type';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginResponse> {
    const username = input.username.trim();
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        username: user.username,
        type: 'refresh',
      },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret',
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') ?? '7d',
      },
    );

    return { token, refreshToken };
  }
}