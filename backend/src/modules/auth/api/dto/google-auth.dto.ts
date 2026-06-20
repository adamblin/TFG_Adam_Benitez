import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({ description: 'Google OAuth access token obtained from the client' })
  @IsString()
  accessToken!: string;
}
