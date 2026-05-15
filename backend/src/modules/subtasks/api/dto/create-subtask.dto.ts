import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubtaskDto {
  @ApiProperty({ example: 'cmnu7lgbr0001vo7scgyufx6e' })
  @IsString()
  taskId!: string;

  @ApiProperty({ example: 'Investigar sobre NestJS', maxLength: 120 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : ''))
  @IsString()
  @MaxLength(120)
  title!: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
