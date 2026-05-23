import { ApiProperty } from '@nestjs/swagger';

export class PhraseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  text: string;

  @ApiProperty({ enum: ['TASK', 'SUBTASK', 'FOCUS'] })
  category: string;
}
