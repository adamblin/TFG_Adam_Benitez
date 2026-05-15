import { ApiProperty } from '@nestjs/swagger';

export class SubtaskResponseDto {
  @ApiProperty({ example: 'cmnu7lgbr0001vo7scgyufx6e' })
  id!: string;

  @ApiProperty({ example: 'cmnu7lgbr0001vo7scgyufx6e' })
  taskId!: string;

  @ApiProperty({ example: 'Example subtask' })
  title!: string;

  @ApiProperty({ example: false })
  completed!: boolean;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ example: '2026-12-31T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-12-31T00:00:00.000Z' })
  updatedAt!: string;
}
