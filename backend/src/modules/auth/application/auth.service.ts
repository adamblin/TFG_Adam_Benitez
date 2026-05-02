import { Injectable } from '@nestjs/common';
import { RegisterUserUseCase } from '../../users/application/use-cases/register-user.use-case';
import { RegisterUserResponse } from '../../users/application/types/register-user-response.type';
import { LoginUserDto } from '../api/dto/login-user.dto';
import { RegisterUserDto } from '../api/dto/register-user.dto';
import { RefreshTokenDto } from '../api/dto/refresh-token.dto';
import { LoginUserUseCase } from './use-cases/login-user.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { LoginResponse } from './types/login-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  register(dto: RegisterUserDto): Promise<RegisterUserResponse> {
    return this.registerUserUseCase.execute({
      email: dto.email,
      username: dto.username,
      password: dto.password,
    });
  }

  login(dto: LoginUserDto): Promise<LoginResponse> {
    return this.loginUserUseCase.execute({
      username: dto.username,
      password: dto.password,
    });
  }

  refresh(dto: RefreshTokenDto): Promise<LoginResponse> {
    return this.refreshTokenUseCase.execute({
      refreshToken: dto.refreshToken,
    });
  }
}
