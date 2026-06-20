import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../../users/domain/repositories/users.repository';
import { GoogleAuthResponse } from '../types/google-auth-response.type';

/** Establece el username de un usuario OAuth que aún no lo tiene. Devuelve nuevos tokens JWT con el username actualizado. */
@Injectable()
export class CompleteProfileUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(input: {
    userId: string;
    username: string;
  }): Promise<GoogleAuthResponse> {
    const username = input.username.trim();

    const existing = await this.usersRepository.findByUsername(username);
    if (existing) {
      throw new ConflictException('Username already in use');
    }

    const user = await this.usersRepository.updateUsername(
      input.userId,
      username,
    );

    const token = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, username: user.username, type: 'refresh' },
      {
        secret:
          this.configService.get('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret',
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') ?? '7d',
      },
    );

    return { token, refreshToken, needsUsername: false };
  }
}
