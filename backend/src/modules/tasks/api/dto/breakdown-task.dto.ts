import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BreakdownTaskDto {
  @ApiProperty({
    description: 'Task description to break down',
    maxLength: 300,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title: string;
}

export class BreakdownResponseDto {
  @ApiProperty({ description: 'AI-generated task name' })
  title: string;

  @ApiProperty({
    type: [String],
    description: 'Generated subtasks in logical order',
  })
  subtasks: string[];
}
