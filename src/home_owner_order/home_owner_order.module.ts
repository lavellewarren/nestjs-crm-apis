import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeOwnerOrderController } from './home_owner_order.controller';
import { HomeOwnerOrderService } from './home_owner_order.service';

import HomeOwnerOrder from './entity/home_order.entity';
import HomeAppliedCoupon from './entity/home_applied_coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HomeOwnerOrder, HomeAppliedCoupon])],
  controllers: [HomeOwnerOrderController],
  providers: [HomeOwnerOrderService],
})
export class HomeOwnerOrderModule { }
