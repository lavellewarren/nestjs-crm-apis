import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealEstateOrderController } from './real_estate_order.controller';
import { RealEstateOrderService } from './real_estate_order.service';

import RealEstateOrder from './entity/real_order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RealEstateOrder])],
  controllers: [RealEstateOrderController],
  providers: [RealEstateOrderService]
})

export class RealEstateOrderModule { }
