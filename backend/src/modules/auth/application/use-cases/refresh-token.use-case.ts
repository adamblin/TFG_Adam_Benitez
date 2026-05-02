import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../../users/domain/repositories/users.repository';
import { RefreshTokenInput } from '../inputs/refresh-token.input';
import { LoginResponse } from '../types/login-response.type';

type RefreshTokenPayload = {
  sub: string;
  username: string;
  type?: string;
};

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(input: RefreshTokenInput): Promise<LoginResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(input.refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret',
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
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
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}