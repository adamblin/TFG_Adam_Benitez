import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SessionResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() userId!: string;
  @ApiPropertyOptional({ nullable: true }) taskId!: string | null;
  @ApiProperty() durationMin!: number;
  @ApiProperty() startedAt!: string;
  @ApiPropertyOptional({ nullable: true }) endedAt!: string | null;
  @ApiProperty() completed!: boolean;
  @ApiProperty() createdAt!: string;
  @ApiProperty() updatedAt!: string;
}

export class EndSessionResponseDto {
  @ApiProperty({ type: SessionResponseDto }) session!: SessionResponseDto;
  @ApiProperty({ example: 'Focus session complete! Every session counts.' }) message!: string;
}
