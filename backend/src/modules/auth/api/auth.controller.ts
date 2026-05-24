import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../application/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthMeResponseDto } from './dto/auth-me-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

type AuthenticatedRequest = Request & {
  user: { sub: string; username: string };
};

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ type: LoginResponseDto })
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with username and password' })
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh the access token using a refresh token' })
  @ApiOkResponse({ type: LoginResponseDto })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current authenticated user' })
  @ApiOkResponse({ type: AuthMeResponseDto })
  me(@Req() req: AuthenticatedRequest): AuthMeResponseDto {
    return { id: req.user.sub, username: req.user.username };
  }
}
