import { Body, Controller, Post, Res } from '@nestjs/common';
import { ChargeCardDto } from './dto/charge-card.dto';
import { PaymentService } from './payment.service';
import { Card } from './type/card.interface';
import { Order } from './type/order.interface';
import { Response } from 'express';
import { ValidateCoupon } from './dto/validate-coupon.dto';
import { BillInfo } from './type/bill-info.interface';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('credit-card/checkout')
  public async chargeCreditCard(
    @Body() chargeCardDto: ChargeCardDto,
    @Res() res: Response,
  ) {
    const card: Card = {
      cardCode: chargeCardDto.card_code,
      cardNumber: chargeCardDto.card_number,
      expirationDate: chargeCardDto.expiration_date,
    };

    const coupon: ValidateCoupon = {
      code: chargeCardDto.coupon,
      product: chargeCardDto.product_name,
    };

    const order: Order = {
      amount: chargeCardDto.amount,
      invoiceNumber: chargeCardDto.invoice_number,
      productDescription: chargeCardDto.product_description,
      productName: chargeCardDto.product_name,
    };

    const billInfo: BillInfo = {
      first_name: chargeCardDto.first_name,
      last_name: chargeCardDto.last_name,
      company_name: chargeCardDto.company_name,
      country: chargeCardDto.country,
      street: chargeCardDto.bill_street,
      apartment: chargeCardDto.bill_apartment,
      city: chargeCardDto.bill_city,
      state: chargeCardDto.bill_state,
      zip_code: chargeCardDto.bill_zip_code,
      phone: chargeCardDto.phone,
      email: chargeCardDto.email,
    };

    this.paymentService.chargeCreditCard(card, order, coupon, billInfo, res);
  }

  @Post('coupons/validate')
  public async validateCoupon(@Body() coupon: ValidateCoupon) {
    return this.paymentService.checkValidCoupon(coupon);
  }
}
