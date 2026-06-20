import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class CompleteProfileDto {
  @ApiProperty({ example: 'john_doe', minLength: 3, maxLength: 20 })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message: 'Username may only contain letters, numbers, dots, underscores and hyphens',
  })
  username!: string;
}
