import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../../users/domain/repositories/users.repository';
import { GoogleAuthResponse } from '../types/google-auth-response.type';

type GoogleUserInfo = {
  sub: string;
  email: string;
  name?: string;
};

/** Autentica un usuario via Google OAuth, creando la cuenta si no existe. Devuelve tokens JWT y un flag si falta username. */
@Injectable()
export class GoogleAuthUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(input: { accessToken: string }): Promise<GoogleAuthResponse> {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${input.accessToken}` },
    });

    if (!res.ok) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const googleUser = (await res.json()) as GoogleUserInfo;

    let user = await this.usersRepository.findByGoogleId(googleUser.sub);

    if (!user) {
      const existingByEmail = await this.usersRepository.findByEmail(
        googleUser.email,
      );
      if (existingByEmail) {
        user = await this.usersRepository.update(existingByEmail.id, {
          googleId: googleUser.sub,
        });
      } else {
        user = await this.usersRepository.createOAuthUser({
          email: googleUser.email,
          googleId: googleUser.sub,
        });
      }
    }

    const needsUsername = !user.username;
    const username = user.username ?? '';

    const token = await this.jwtService.signAsync({
      sub: user.id,
      username,
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, username, type: 'refresh' },
      {
        secret:
          this.configService.get('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret',
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') ?? '7d',
      },
    );

    return { token, refreshToken, needsUsername };
  }
}
