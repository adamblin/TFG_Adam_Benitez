import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { JwtAuthGuard } from 'src/modules/auth/api/guards/jwt-auth.guard';
import { UsersRepository } from '../domain/repositories/users.repository';

type AuthenticatedRequest = Request & {
  user: { sub: string; username: string };
};

export class UserProfileResponseDto {
  @ApiProperty({ example: 'cmnt7uacz0000vodch0gop9uj' })
  id!: string;

  @ApiProperty({ example: 'john_doe' })
  username!: string;

  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @ApiProperty()
  createdAt!: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'new_username' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username?: string;

  @ApiPropertyOptional({ example: 'new@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Get('me')
  @ApiOperation({ summary: 'Get full profile of the current user' })
  @ApiOkResponse({ type: UserProfileResponseDto })
  async me(@Req() req: AuthenticatedRequest): Promise<UserProfileResponseDto> {
    const user = await this.usersRepository.findById(req.user.sub);
    return {
      id: user!.id,
      username: user!.username,
      email: user!.email,
      createdAt: user!.createdAt.toISOString(),
    };
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update username or email of the current user' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserProfileResponseDto })
  async updateMe(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersRepository.update(req.user.sub, dto);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
