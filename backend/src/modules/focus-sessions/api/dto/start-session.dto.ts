import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartSessionDto {
  @ApiProperty({ example: 25, description: 'Planned duration in minutes' })
  @IsInt()
  @Min(1)
  @Max(180)
  durationMin!: number;

  @ApiPropertyOptional({ example: 'cmp4arbf1000bvozsds6vc2ay' })
  @IsOptional()
  @IsString()
  taskId?: string;
}
