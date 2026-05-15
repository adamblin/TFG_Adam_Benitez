import { ApiProperty } from '@nestjs/swagger';

export class SubtaskSummaryDto {
  @ApiProperty() id!: string;
  @ApiProperty() title!: string;
  @ApiProperty() completed!: boolean;
  @ApiProperty() order!: number;
  @ApiProperty() createdAt!: string;
  @ApiProperty() updatedAt!: string;
}

export class TaskResponseDto {
  @ApiProperty({ example: 'cmnu7lgbr0001vo7scgyufx6e' })
  id!: string;

  @ApiProperty({ example: 'Primera tarea' })
  title!: string;

  @ApiProperty({ example: 'Descripcion opcional', nullable: true })
  description!: string | null;

  @ApiProperty({ example: false })
  completed!: boolean;

  @ApiProperty({ example: '2026-05-15T10:30:00.000Z', nullable: true })
  completedAt!: string | null;

  @ApiProperty({ example: '2026-12-31T00:00:00.000Z', nullable: true })
  dueDate!: string | null;

  @ApiProperty({ type: [SubtaskSummaryDto] })
  subtasks!: SubtaskSummaryDto[];

  @ApiProperty({ example: '2026-04-11T10:45:47.361Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-04-11T10:59:12.000Z' })
  updatedAt!: string;
}
