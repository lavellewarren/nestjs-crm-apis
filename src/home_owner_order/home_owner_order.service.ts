import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, getManager, QueryFailedError, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


import HomeProduct from './entity/home_product.entity';
import HomeOwnerOrder from './entity/home_order.entity';
import HomeOrderItem from './entity/home_order_item.entity';
import HomeCoverageUpgrade from './entity/home_coverage_upgrade.entity';
import HomeProductLocation from './entity/home_product_location.entity';
import HomeCoupon from './entity/home_coupon.entity';
import HomeLocationFeature from './entity/home_location_feature.entity';
import HomeAppliedCoupon from './entity/home_applied_coupon.entity';


import { CreateHomeOwnerOrderDTO } from './dto/create_home_owner_order.dto';
import { CreateHomeOrderItemDTO } from './dto/create_home_order_item.dto';
import { CheckHomeCouponDTO } from './dto/check_home_coupon.dto';
import { CreateHomeAppliedCouponDTO } from './dto/create_home_applied_coupon.dto';
import { convertFDY } from '../global/util';
import HomeStandardTitle from './entity/home_standard_title.entity';

@Injectable()
export class HomeOwnerOrderService {
  constructor(
    @InjectRepository(HomeOwnerOrder)
    private homeOwnerOrderRepository: Repository<HomeOwnerOrder>,
  ) { }

  createCheckoutOrder(homeOwnerOrder: CreateHomeOwnerOrderDTO): Promise<HomeOwnerOrder> {
    const _homeOwnerOrder: any = this.homeOwnerOrderRepository.create(homeOwnerOrder);
    return this.homeOwnerOrderRepository.save(_homeOwnerOrder).catch((err: any) => {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
  }

  findAll(): Promise<HomeOwnerOrder[]> {
    return this.homeOwnerOrderRepository.find();
  }

  findOne(id: string): Promise<HomeOwnerOrder> {
    return this.homeOwnerOrderRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.homeOwnerOrderRepository.delete(id);
  }

  async getOrderinfo(order_id: string): Promise<any> {

    const _homeOwnerOrder = await this.homeOwnerOrderRepository.findOne({ relations: ["applied_coupons", "order_items"], where: { home_order_id: order_id }, order: { home_order_id: 'ASC' } });
    if (_homeOwnerOrder) {
      _homeOwnerOrder['order_date'] = convertFDY(_homeOwnerOrder.created_at);
    }
    const _orderItems = _homeOwnerOrder['order_items'];
    const _orders_ = await getManager().getRepository(HomeOrderItem).find({ relations: ["product_id"] });
    for (const item of _orderItems) {
      const product_id = _orders_.find(it => it.home_order_item_id == item.home_order_item_id).product_id['home_product_id'];
      if (item.product_type == 'simple') {
        const productinfo = await getManager().getRepository(HomeProduct).findOne({ where: { home_product_id: product_id } });
        item['productinfo'] = productinfo;
      }
      else {
        const productinfo = await getManager().getRepository(HomeCoverageUpgrade).findOne({ where: { home_product_id: product_id } });
        item['productinfo'] = productinfo;
      }
    }
    _homeOwnerOrder['productitems'] = _orderItems
    return _homeOwnerOrder;
  }

  async getAllHomeLocations(): Promise<any> {
    return await getManager().getRepository(HomeProductLocation).find();
  }

  async getHomeProducts(location_id: string): Promise<any> {
    const products: any = await getManager().getRepository(HomeProduct).find({
      relations: ['home_property_type_id', 'home_product_location_id'],
      where: { home_product_location_id: location_id }
    });
    if (products.length) {
      products.forEach((product) => {
        if (product.unique_features != "") {
          const unique_features: any[] = [];
          const p_features: any[] = JSON.parse(product.unique_features);
          for (const key in p_features) {
            const _k = Number(key);
            const _v = p_features[key] == "0" ? "No" : "Yes";
            unique_features.push({ 'key': _k, 'value': _v })
            console.log({ 'key': _k, 'value': _v })
            product['unique_features'] = unique_features;
          }
        }
      });
      return products;
    }
  }

  async gethomeLocationUniqueFeatures(location_id: string): Promise<any> {
    return await getManager().getRepository(HomeLocationFeature).find({
      where: { home_product_location_id: location_id }
    });
  }

  async getHomeProductCovUpgrade(product_id: string): Promise<any> {
    const upgrades: any = await getManager().getRepository(HomeCoverageUpgrade).find({
      where: { home_product_id: product_id }
    });

    const newupgrades: any = [];
    for (const upgrade of upgrades) {
      upgrade.quantity = 0;
      if (upgrade.content != '') {
        upgrade.content = JSON.parse(upgrade.content);
      }
      newupgrades.push(upgrade)
    }

    return newupgrades;
  }

  async addItemsinOrder(
    homeOrderItem: CreateHomeOrderItemDTO,
  ): Promise<any> {
    const _repo = getManager().getRepository(HomeOrderItem);
    const _homeOrderItem = _repo.create(homeOrderItem);
    return await _repo.save(_homeOrderItem).catch((err: any) => {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
  }

  async checkCoupon(
    homeCoupon: CheckHomeCouponDTO,
  ): Promise<any> {
    const _repo = getManager().getRepository(HomeCoupon);
    const coupon: any = await _repo.findOne({ where: { coupon_code: homeCoupon.coupon_code } }).catch((err: any) => {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
    console.log('coupon:', coupon)
    if (coupon.coupon_code != "") {
      const now = new Date();
      const expire_date = new Date(homeCoupon.expiry_date);
      if (expire_date > now) {
        return ({
          "result": true,
          "message": "Coupon Applied Successfully",
          "data": coupon.coupon_code,
          "statusCode": HttpStatus.CREATED
        });
      }
      return ({
        "result": false,
        "message": "Coupon Code is Expired",
        "data": coupon.coupon_code,
        "statusCode": HttpStatus.UNPROCESSABLE_ENTITY
      });
    }
    else {
      throw new HttpException(
        "Invalid Coupon Code",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async applyCoupon(
    homeAppliedCoupon: CreateHomeAppliedCouponDTO,
  ): Promise<any> {
    const _repo = getRepository(HomeAppliedCoupon);
    const _homeAppliedCoupon = _repo.create(homeAppliedCoupon);

    await _repo.save(_homeAppliedCoupon).catch((err: any) => {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          'failed: ' + err.message,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    });

    return ({
      "result": false,
      "message": "Coupon record saved",
      "statusCode": HttpStatus.CREATED
    });

  }

  async getHomeStandardFeatures(location_id: string): Promise<any> {
    return await getManager().getRepository(HomeStandardTitle).find({
      relations: ['home_product_location'],
      where: { home_product_location: location_id }
    });
  }

}
