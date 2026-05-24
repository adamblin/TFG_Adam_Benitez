import { ApiProperty } from '@nestjs/swagger';

export class AuthMeResponseDto {
  @ApiProperty({ example: 'cmnt7uacz0000vodch0gop9uj' })
  id!: string;

  @ApiProperty({ example: 'john_doe' })
  username!: string;
}
