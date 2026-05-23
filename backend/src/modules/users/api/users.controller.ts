import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth.guard';

type AuthenticatedRequestUser = {
  sub: string;
  username: string;
};

type AuthenticatedRequest = Request & {
  user: AuthenticatedRequestUser;
};

class MeResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() username!: string;
}

type UpdateMeBody = {
  username?: string;
  email?: string;
};

@Controller('users')
@ApiTags('Users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current authenticated user' })
  @ApiOkResponse({ type: MeResponseDto })
  me(@Req() req: AuthenticatedRequest) {
    return { id: req.user.sub, username: req.user.username };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current authenticated user (partial)' })
  @ApiOkResponse({ type: MeResponseDto })
  updateMe(@Req() req: AuthenticatedRequest, @Body() body: UpdateMeBody) {
    const allowed: UpdateMeBody = {};
    if (body.username) allowed.username = String(body.username).trim();
    if (body.email) allowed.email = String(body.email).trim().toLowerCase();
    return { id: req.user.sub, ...allowed };
  }
}
