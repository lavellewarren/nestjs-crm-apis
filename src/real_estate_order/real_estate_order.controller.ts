import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { RealEstateOrderService } from './real_estate_order.service'
import { Response } from 'express';

import { CreateRealEstateOrderDTO } from './dto/create_real_estate_order.dto';
import { CreateRealOrderItemDTO } from './dto/create_real_item.dto';
import { PDFInvoiceGenerator } from '../global/pdf'
import { sendInvoiceDTO } from './dto/send_invoice.dto';
import { GetQuestionDTO } from './dto/get_question.dto';
import { GetProductDTO } from './dto/get_product.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
import { testInvoiceDTO } from './dto/test_invoice.dto';

@ApiTags('Real Estate Order')
@Controller('/realestateorder')
export class RealEstateOrderController {

  constructor(private readonly realEstateOrderService: RealEstateOrderService) { }

  @Post('saveRealestateOrder')
  async createCheckoutOrder(@Body() realEstateOrder: CreateRealEstateOrderDTO) {
    return this.realEstateOrderService.saveRealestateOrder(realEstateOrder)
  }

  @Post('storeRealOrderitems')
  async storeRealOrderitems(@Body() items: CreateRealOrderItemDTO[]) {
    return this.realEstateOrderService.storeRealOrderitems(items)
  }

  @Get('getRealOrder')
  async getRealOrder(@Query('order_id') order_id: string) {
    return this.realEstateOrderService.getRealOrder(order_id)
  }

  @Get('getRealOrders')
  async getRealOrders() {
    return this.realEstateOrderService.getRealOrders()
  }

  @Get('checkRealCouponExist')
  async checkRealCouponExist(@Query('coupon_code') coupon_code: string) {
    return this.realEstateOrderService.checkRealCouponExist(coupon_code);
  }

  @Get('createCustomerInvoice')
  async createCustomerInvoice(@Query('order_id') order_id: string, @Res() res: Response): Promise<void> {
    const { buffer, token } = await this.realEstateOrderService.createCustomerInvoice(order_id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-inline': 'attachment; filename=' + token + '.pdf',
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }

  @Post('sendInvoiceEmail')
  async SendInvoiceEmail(@Body() sendInvoiceTo: sendInvoiceDTO) {
    return this.realEstateOrderService.SendInvoiceEmail(sendInvoiceTo)
  }

  @Get('sendDailyOrderReport')
  async sendDailyOrderReport() {
    return this.realEstateOrderService.sendDailyOrderReport();
  }

  //For get Realstate all states
  @Get('getStates')
  async getStates() {
    return this.realEstateOrderService.getStates();
  }

  //For get Realstate Coverage types
  @Get('getCovType')
  async getCovType() {
    return this.realEstateOrderService.getCovType();
  }

  //For get Realstate Property_types 
  @Post('getQuestions')
  async getQuestions(@Body() getQuestion: GetQuestionDTO) {
    return this.realEstateOrderService.getQuestions(getQuestion);
  }

  //For get Realstate Products 
  @Post('getProducts')
  async getProducts(@Body() getProduct: GetProductDTO) {
    return this.realEstateOrderService.getProducts(getProduct);
  }
  //To get Realstate Features
  @Get('getLocationFeatures')
  async getLocationFeatures(@Query('state_id') state_id: string) {
    return this.realEstateOrderService.getLocationFeatures(state_id);
  }
  //get realstate standard features
  @Get('getRealstateFeatures')
  async getRealstateFeatures(@Query('location_id') location_id: string) {
    return this.realEstateOrderService.getRealstateFeatures(location_id);
  }

  @Get('getProductCoverage')
  async getProductCoverage(@Query('prod_id') prod_id: string) {
    return this.realEstateOrderService.getProductCoverage(prod_id);
  }

  @Get('getUserTypes')
  async getUserTypes() {
    return this.realEstateOrderService.getUserTypes();
  }

  @Get('getFile')
  getFile(@Res() res: Response, @Query('token') fileName: string, @Query('type') type: string) {
    let fileType = "";
    if (type == "invoice") fileType = ".pdf";
    else if (type == "report") fileType = ".csv";

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + type + fileType,
      'Content-Transfer-Encoding': 'binary',
      'Connection': 'Keep-Alive'
    })
    const file = createReadStream(join(process.cwd(), 'public/' + type + '/' + fileName + fileType));
    file.pipe(res);
  }
  @Post('testInvoice')
  async testInvoice(@Body() testInvoice: testInvoiceDTO) {
    return this.realEstateOrderService.testInvoice(testInvoice);
  }
}
