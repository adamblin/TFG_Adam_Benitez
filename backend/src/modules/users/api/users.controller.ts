import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth.guard';

type AuthenticatedRequestUser = {
  sub: string;
  username: string;
};

type AuthenticatedRequest = Request & {
  user: AuthenticatedRequestUser;
};

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
  me(@Req() req: AuthenticatedRequest) {
    return { id: req.user.sub, username: req.user.username };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current authenticated user (partial)' })
  updateMe(@Req() req: AuthenticatedRequest, @Body() body: UpdateMeBody) {
    // For now, keep this as a stub that echoes allowed fields.
    const allowed: UpdateMeBody = {};
    if (body.username) allowed.username = String(body.username).trim();
    if (body.email) allowed.email = String(body.email).trim().toLowerCase();
    return { id: req.user.sub, ...allowed };
  }
}
