import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ItemActionDto {
  @ApiProperty({ example: 'icon_red' })
  @IsString()
  itemId!: string;
}

export class CatalogItemResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() type!: string;
  @ApiProperty() name!: string;
  @ApiProperty() color!: string;
  @ApiProperty() rarity!: string;
  @ApiProperty() price!: number;
  @ApiProperty() owned!: boolean;
  @ApiProperty() equipped!: boolean;
}

export class PreferencesResponseDto {
  @ApiProperty() iconColor!: string;
  @ApiProperty() theme!: string;
}

export class PurchaseResponseDto {
  @ApiProperty() coins!: number;
}
