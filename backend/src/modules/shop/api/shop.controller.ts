import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/api/guards/jwt-auth.guard';
import { ShopService } from '../application/shop.service';
import {
  CatalogItemResponseDto,
  ItemActionDto,
  PreferencesResponseDto,
  PurchaseResponseDto,
} from './dto/shop.dto';

type AuthRequest = Request & { user: { sub: string } };

@Controller('shop')
@ApiTags('Shop')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('catalog')
  @ApiOperation({ summary: 'Get shop catalog with owned/equipped status' })
  @ApiOkResponse({ type: [CatalogItemResponseDto] })
  getCatalog(@Req() req: AuthRequest): Promise<CatalogItemResponseDto[]> {
    return this.shopService.getCatalog(req.user.sub);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get current user preferences' })
  @ApiOkResponse({ type: PreferencesResponseDto })
  getPreferences(@Req() req: AuthRequest): Promise<PreferencesResponseDto> {
    return this.shopService.getPreferences(req.user.sub);
  }

  @Post('purchase')
  @ApiOperation({ summary: 'Purchase a shop item' })
  @ApiOkResponse({ type: PurchaseResponseDto })
  purchase(@Req() req: AuthRequest, @Body() body: ItemActionDto): Promise<PurchaseResponseDto> {
    return this.shopService.purchase(req.user.sub, body.itemId);
  }

  @Post('equip')
  @ApiOperation({ summary: 'Equip an owned item' })
  @ApiOkResponse({ type: PreferencesResponseDto })
  equip(@Req() req: AuthRequest, @Body() body: ItemActionDto): Promise<PreferencesResponseDto> {
    return this.shopService.equip(req.user.sub, body.itemId);
  }
}
