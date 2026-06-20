import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import type { Response } from 'express';
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
import { GoogleAuthDto } from './dto/google-auth.dto';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { GoogleAuthResponseDto } from './dto/google-auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

type AuthenticatedRequest = Request & {
  user: { sub: string; username: string };
};

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in or sign up with a Google OAuth access token' })
  @ApiOkResponse({ type: GoogleAuthResponseDto })
  async googleAuth(@Body() dto: GoogleAuthDto) {
    return this.authService.googleAuth(dto.accessToken);
  }

  @Get('google/init')
  @ApiOperation({ summary: 'Redirect to Google OAuth consent page (backend-driven flow)' })
  async googleInit(@Query('platform') platform: string, @Res() res: Response) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID') ?? '';
    const redirectUri =
      this.configService.get<string>('GOOGLE_REDIRECT_URI') ??
      'http://localhost:3000/auth/google/callback';

    const state = Buffer.from(JSON.stringify({ platform: platform ?? 'native' })).toString('base64url');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      access_type: 'online',
      state,
    });

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback — exchanges code and redirects to the app' })
  async googleCallback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    let platform = 'native';
    try {
      const decoded = JSON.parse(Buffer.from(state ?? '', 'base64url').toString()) as { platform?: string };
      platform = decoded.platform ?? 'native';
    } catch { /* use default */ }

    const appScheme = this.configService.get<string>('FRONTEND_SCHEME') ?? 'tfgapp';
    const webFrontend = this.configService.get<string>('FRONTEND_WEB_URL') ?? 'http://localhost:8081';

    const errorRedirect = platform === 'web'
      ? `${webFrontend}/auth/google/success?error=${encodeURIComponent(error ?? 'cancelled')}`
      : `${appScheme}://auth?error=${encodeURIComponent(error ?? 'cancelled')}`;

    if (error || !code) {
      res.redirect(errorRedirect);
      return;
    }

    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID') ?? '';
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '';
    const redirectUri =
      this.configService.get<string>('GOOGLE_REDIRECT_URI') ??
      'http://localhost:3000/auth/google/callback';

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    });

    const tokenData = (await tokenRes.json()) as { access_token?: string };

    if (!tokenData.access_token) {
      res.redirect(errorRedirect.replace(error ?? 'cancelled', 'token_exchange_failed'));
      return;
    }

    const result = await this.authService.googleAuth(tokenData.access_token);

    const callbackParams = new URLSearchParams({
      token: result.token,
      refreshToken: result.refreshToken,
      needsUsername: String(result.needsUsername),
    });

    const finalRedirect = platform === 'web'
      ? `${webFrontend}/auth/google/success?${callbackParams.toString()}`
      : `${appScheme}://auth?${callbackParams.toString()}`;

    res.redirect(finalRedirect);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('complete-profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set username for an OAuth user who has not set one yet' })
  @ApiOkResponse({ type: GoogleAuthResponseDto })
  async completeProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CompleteProfileDto,
  ) {
    return this.authService.completeProfile(req.user.sub, dto.username);
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
