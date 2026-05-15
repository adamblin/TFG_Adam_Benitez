import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EndSessionDto {
  @ApiProperty({ example: 'cmp4arbf1000bvozsds6vc2ay' })
  @IsString()
  sessionId!: string;

  @ApiProperty({ example: true, description: 'Whether the user completed the full session' })
  @IsBoolean()
  completed!: boolean;
}
