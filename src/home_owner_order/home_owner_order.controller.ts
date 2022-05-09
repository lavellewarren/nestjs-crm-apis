import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { HomeOwnerOrderService } from './home_owner_order.service';

import { CreateHomeOwnerOrderDTO } from './dto/create_home_owner_order.dto';
import { CreateHomeOrderItemDTO } from './dto/create_home_order_item.dto';
import { CheckHomeCouponDTO } from './dto/check_home_coupon.dto';
import { CreateHomeAppliedCouponDTO } from './dto/create_home_applied_coupon.dto';


@ApiTags('Home Owner Order')
@Controller('homeownerorder')
export class HomeOwnerOrderController {
  constructor(private readonly homeOwnerOrderService: HomeOwnerOrderService) { }

  @Post('create_checkout')
  async createCheckoutOrder(@Body() homeOwnerOrder: CreateHomeOwnerOrderDTO) {
    return this.homeOwnerOrderService.createCheckoutOrder(homeOwnerOrder);
  }

  @Get('getOrderinfo')
  async getOrderinfo(@Query('order_id') order_id: string) {
    return this.homeOwnerOrderService.getOrderinfo(order_id);
  }

  @Get('getHomeLocations')
  async getAllHomeLocations() {
    return this.homeOwnerOrderService.getAllHomeLocations();
  }

  @Get('getHomeProducts')
  async getHomeProducts(@Query('location_id') location_id: string) {
    return this.homeOwnerOrderService.getHomeProducts(location_id);
  }

  @Get('getHomeLocationUniqueFeatures')
  async gethomeLocationUniqueFeatures(@Query('location_id') location_id: string) {
    return this.homeOwnerOrderService.gethomeLocationUniqueFeatures(location_id);
  }

  @Get('getHomeProductCovUpgrade')
  async getHomeProductCovUpgrade(@Query('product_id') product_id: string) {
    return this.homeOwnerOrderService.getHomeProductCovUpgrade(product_id);
  }

  @Post('addItemsinOrder')
  async addItemsinOrder(@Body() homeOrderItem: CreateHomeOrderItemDTO) {
    return this.homeOwnerOrderService.addItemsinOrder(homeOrderItem);
  }

  @Post('checkCoupon')
  async checkCoupon(@Body() homeCoupon: CheckHomeCouponDTO) {
    return this.homeOwnerOrderService.checkCoupon(homeCoupon);
  }

  @Post('applyCoupon')
  async applyCoupon(@Body() homeAppliedCoupon: CreateHomeAppliedCouponDTO) {
    return this.homeOwnerOrderService.applyCoupon(homeAppliedCoupon);
  }

  @Get('getHomeStandardFeatures')
  async getHomeStandardFeatures(@Query('location_id') location_id: string) {
    return this.homeOwnerOrderService.getHomeStandardFeatures(location_id);
  }
}
