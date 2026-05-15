import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { XPModule } from 'src/modules/xp/xp.module';
import { ShopRepository } from './domain/repositories/shop.repository';
import { PrismaShopRepository } from './infrastructure/repositories/prisma-shop.repository';
import { ShopService } from './application/shop.service';
import { ShopController } from './api/shop.controller';

@Module({
  imports: [PrismaModule, XPModule],
  controllers: [ShopController],
  providers: [
    { provide: ShopRepository, useClass: PrismaShopRepository },
    ShopService,
  ],
})
export class ShopModule {}
