import { ApiProperty } from '@nestjs/swagger';

export class LevelInfoDto {
  @ApiProperty() totalXp!: number;
  @ApiProperty() level!: number;
  @ApiProperty() xpInLevel!: number;
  @ApiProperty() xpToNextLevel!: number;
  @ApiProperty() progressPercent!: number;
  @ApiProperty() coins!: number;
}
