import { ApiProperty } from '@nestjs/swagger';

export class PhraseResponseDto {
  @ApiProperty({ example: 'cmnt7uacz0000vodch0gop9uj' })
  id!: string;

  @ApiProperty({ example: 'Every expert was once a beginner.' })
  text!: string;

  @ApiProperty({ enum: ['TASK', 'SUBTASK', 'FOCUS'] })
  category!: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt!: string;
}
