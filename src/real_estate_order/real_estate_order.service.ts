import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { getRepository, Repository, QueryFailedError, MoreThan, Between } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';


import { isNotEmpty } from 'class-validator';

import RealProduct from './entity/real_product.entity';
import RealEstateOrder from './entity/real_order.entity';
import RealLocation from './entity/real_location.entity';
import RealCoverage from './entity/real_coverage.entity';
import RealUserType from './entity/real_user_type.entity';
import RealEstateCoupon from './entity/real_coupon.entity';
import RealOrderItem from './entity/real_order_item.entity';
import RealRelationship from './entity/real_relationship.entity';
import RealFeatureTitle from './entity/real_feature_title.entity';
import RealCoverageType from './entity/real_coverage_type.entity';
import RealAppliedCoupon from './entity/real_applied_coupon.entity';
import RealProductFeature from './entity/real_product_feature.entity';
import RealProQsRelationship from './entity/real_pro_qs_relationship.entity';
import RealQuestionRelationship from './entity/real_question_relationship.entity';
import RealProductFeatureRelationship from './entity/real_product_feature_relationship.entity';

import { GetProductDTO } from './dto/get_product.dto';
import { sendInvoiceDTO } from './dto/send_invoice.dto';
import { GetQuestionDTO } from './dto/get_question.dto';
import { CreateRealOrderItemDTO } from './dto/create_real_item.dto';
import { CreateRealEstateOrderDTO } from './dto/create_real_estate_order.dto';


import { IInvoiceContractData, IInvoiceDataTableRow, IInvoiceHeaderData, IInvoiceResultDataRow, IInvoice } from './interface/invoice_interface';

import { convertFDY, isValidNumber, processString } from '../global/util';
import { PDFInvoiceGenerator } from 'src/global/pdf';
import { EmailTemplate, useSendEmail } from 'src/shared/aws-ses.utils';

import configuration from '../config/configuration';
import { testInvoiceDTO } from './dto/test_invoice.dto';

@Injectable()
export class RealEstateOrderService {
  constructor(
    @InjectRepository(RealEstateOrder)
    private realEstateOrderRepository: Repository<RealEstateOrder>,
    private configService: ConfigService
  ) { }

  @Cron(CronExpression.EVERY_DAY_AT_9PM, {
    timeZone: 'America/New_York',
  }) //Called EveryDay at 9PM for Daily Report
  handleCron() {
    this.sendDailyOrderReport();
  }

  async saveRealestateOrder(realEstateOrder: CreateRealEstateOrderDTO): Promise<any> {
    try {
      const order = this.realEstateOrderRepository.create(realEstateOrder);
      if (order.property_coverage_type == '1') {
        if (order.buyer_name == '') {
          throw new HttpException(
            "No buyer name provided",
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
        if (order.buyer_phone == '') {
          throw new HttpException(
            "No buyer phone provided",
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      }

      let discount;


      if (order.coupon_code != '') {
        const coupon = await getRepository(RealEstateCoupon).findOne({
          where: {
            coupon_code: order.coupon_code,
          }
        });
        if (coupon) {
          if (coupon.discount_type == "percent") {
            discount = (realEstateOrder.total_amount * Number(coupon.coupon_amount)) / 100
            const net_amount = order.total_amount - discount;
            order.net_amount = net_amount;
          }
          else {
            discount = coupon.coupon_amount;
            order.net_amount = order.total_amount - Number(discount);
          }
        }
      }


      return await this.realEstateOrderRepository.save(order)
        .then(async (order) => {
          const coupon = await getRepository(RealEstateCoupon).findOne({
            where: {
              coupon_code: order.coupon_code,
            }
          });
          if (coupon) {
            const appliedCoupon = new RealAppliedCoupon();
            appliedCoupon.order_id = order.order_id.toString();
            appliedCoupon.coupon_code = order.coupon_code;
            appliedCoupon.discount = discount;
            appliedCoupon.save();
            return {
              "result": true,
              'message': 'Your order is registered successfully.',
              'order_id': appliedCoupon.order_id
            };
          }
        })
        .catch((err: any) => {
          if (err instanceof QueryFailedError) {
            throw new HttpException(
              err.message,
              HttpStatus.BAD_REQUEST,
            );
          }
        });
    }
    catch (err: any) {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    };

  }

  findAll(): Promise<RealEstateOrder[]> {
    return this.realEstateOrderRepository.find();
  }

  findOne(id: string): Promise<RealEstateOrder> {
    return this.realEstateOrderRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.realEstateOrderRepository.delete(id);
  }

  async storeRealOrderitems(items: CreateRealOrderItemDTO[]): Promise<any> {
    const _repo = getRepository(RealOrderItem);
    if (items.length) {
      items.forEach(async (item) => {
        const _item: any = _repo.create(item);
        _item['line_total'] = Number(item.rate) * Number(item.quantity)
        return await _repo.save(_item).catch((err: any) => {
          if (err instanceof QueryFailedError) {
            throw new HttpException(
              err.message,
              HttpStatus.BAD_REQUEST,
            );
          }
        });
      });
      return {
        "result": true,
        "message": "Products added in the Order"
      };
    }
    else {
      return {
        "result": false,
        "message": "failed record created"
      };
    }
  }

  async getRealOrder(order_id: string): Promise<any> {
    const _repo = getRepository(RealEstateOrder);
    const _order: any = await _repo.findOne({
      relations: ['property_coverage_type', 'property_type', 'property_location'],
      where: {
        order_id: order_id
      }
    }).catch((err: any) => {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    if (typeof _order === 'undefined') {
      throw new HttpException(
        'No Order',
        HttpStatus.SEE_OTHER,
      );
    };
    const _orderItems = await getRepository(RealOrderItem).find({
      relations: ['order', 'product'],
      where: {
        order: order_id
      }
    }).catch((err: any) => {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    });


    const invoiceReceivers: any = [];
    if (_order.buyer_email != '') invoiceReceivers.push({ name: 'The Buyer', isAdded: false });
    if (_order.buyer_agentemail != '') invoiceReceivers.push({ name: 'The Buyer\'s Agent', isAdded: false });
    if (_order.buyer_coordinatoremail != '') invoiceReceivers.push({ name: 'The Buyer\'s Coordinator', isAdded: false });
    if (_order.seller_email != '') invoiceReceivers.push({ name: 'The Seller', isAdded: false });
    if (_order.seller_agentemail != '') invoiceReceivers.push({ name: 'The Seller Agent', isAdded: false });
    if (_order.seller_coordinatoremail != '') invoiceReceivers.push({ name: 'The Seller Coordinator', isAdded: false });
    if (_order.closing_officeremail != '') invoiceReceivers.push({ name: 'The Closing Officer', isAdded: false });
    if (_order.escrow_assistantemail != '') invoiceReceivers.push({ name: 'The Closing Assistant', isAdded: false });

    _order['invoice_receivers'] = invoiceReceivers;
    _order['product_items'] = _orderItems;
    return _order;
  }

  async getRealOrders(): Promise<any> {
    const _repo = getRepository(RealEstateOrder);
    const _orders: any = await _repo.find({
      relations: ['property_coverage_type', 'property_type', 'property_location']
    }).catch((err: any) => {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    return _orders;
  }

  async checkRealCouponExist(coupon_code: string): Promise<any> {
    if (coupon_code == "") {
      throw new HttpException(
        'No Coupon Code entered.',
        HttpStatus.BAD_REQUEST,
      );
    }
    else {
      const _coupon = await getRepository(RealEstateCoupon).find({
        where: {
          coupon_code: coupon_code,
          expiry_date: MoreThan((new Date()).toISOString().substring(0, 10))
        }
      });
      if ((_coupon).length) {
        return {
          "result": true,
          "message": "Coupon Code applied successfully.",
          "statusCode": HttpStatus.OK
        }
      }
      return {
        "result": false,
        "message": "Coupon Code is invalid or Expired. ",
        "statusCode": HttpStatus.BAD_REQUEST
      }
    }
  }

  async genInvoiceData(order_id: string): Promise<any> {
    const _order: any = await this.realEstateOrderRepository.findOne({
      relations: ['applyCoupons', 'property_coverage_type', 'property_type', 'property_location'],
      where: {
        order_id: order_id
      }
    }).catch((err: any) => {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
    if (typeof _order === 'undefined') {
      throw new HttpException(
        'No Order',
        HttpStatus.BAD_REQUEST,
      );
    }
    _order['order_date'] = convertFDY(_order.created_at);

    const invoice_number = order_id.padStart(8, '0');
    let name = "";
    switch (_order.order_biller) {
      case "The Seller":
        _order['email'] = _order.seller_email;
        _order['company'] = _order.seller_realstate_company;
        _order['phone'] = _order.seller_phone;
        name = _order.seller_name?.split(' ')
        break;
      case "The Seller's Agent":
        _order['email'] = _order.seller_agentemail;
        _order['company'] = _order.seller_realstate_company;
        _order['phone'] = _order.seller_agentphone;
        name = _order.seller_agentname?.split(' ')
        break;
      case "The Buyer":
        _order['email'] = _order.buyer_email;
        _order['company'] = _order.buyer_realstate_company;
        _order['phone'] = _order.buyer_phone;
        name = _order.buyer_name?.split(' ')
        break;
      case "The Buyer's Agent":
        _order['email'] = _order.buyer_agentemail;
        _order['company'] = _order.buyer_realstate_company;
        _order['phone'] = _order.buyer_agentphone;
        name = _order.buyer_agentname?.split(' ')
        break;
      default:
        break;
    }
    if (typeof name !== 'undefined' && typeof name[0] !== 'undefined') {
      _order['firstname'] = name[0];
    }
    else {
      _order['firstname'] = "";
    }
    if (typeof name !== 'undefined' && typeof name[1] !== 'undefined') {
      _order['lastname'] = name[1];
    }
    else {
      _order['lastname'] = '';
    }

    _order['street1'] = "";
    _order['street2'] = "";
    _order['city'] = "";
    _order['state'] = "";
    _order['pincode'] = "";

    const _orderItems: any = await getRepository(RealOrderItem).find({
      where: {
        order: order_id
      }
    }).catch((err: any) => {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
    const invoiceHeaderData: IInvoiceHeaderData = {
      order_date: _order['order_date'],
      invoice_number: invoice_number,
      location_name: _order['property_location']['location_name'],
      co_type_name: _order['property_coverage_type']['type_name'],
      order_biller: _order['order_biller'],
      sales_person: _order['sales_person'],
    }

    const invoiceContractData: IInvoiceContractData = {
      prop_street1: _order['prop_street1'],
      prop_street2: _order['prop_street2'],
      prop_city: _order['prop_city'],
      prop_state: _order['prop_state'],
      prop_zipcode: _order['prop_zipcode'],
      closing_date: _order['closing_date'],
      buyer_name: _order['buyer_name'],
      buyer_email: _order['buyer_email'],
      buyer_phone: _order['buyer_phone'],
      seller_name: _order['buyer_phone'],
      seller_email: _order['buyer_phone'],
      seller_phone: _order['seller_phone'],
      escrow_title: _order['escrow_title'],
      escrow_street1: _order['escrow_street1'],
      escrow_street2: _order['escrow_street2'],
      escrow_city: _order['escrow_city'],
      escrow_state: _order['escrow_state'],
      escrow_zipcode: _order['escrow_zipcode'],
      buyer_agentname: _order['buyer_agentname'],
      buyer_agentemail: _order['buyer_agentemail'],
      buyer_agentphone: _order['buyer_agentphone'],
      seller_agentname: _order['seller_agentname'],
      seller_agentemail: _order['seller_agentemail'],
      seller_agentphone: _order['seller_agentphone'],
      closing_officername: _order['closing_officername'],
      closing_officeremail: _order['closing_officeremail'],
      closing_officerphone: _order['closing_officerphone'],
      escrow_assistantname: _order['escrow_assistantname'],
      escrow_assistantemail: _order['escrow_assistantemail'],
    }

    let invoiceData: any = [];
    _orderItems.forEach(item => {
      const iInvoiceDataTableRow: IInvoiceDataTableRow = {
        date: convertFDY(item.created_at),
        description: item.product_name,
        quantity: item.quantity,
        rate: item.rate,
        line_total: item.line_total,
      }
      invoiceData.push(iInvoiceDataTableRow);
    });

    let IInvoiceResultData: any = [];
    if (isValidNumber(_order['total_amount'])) {
      const _row: IInvoiceResultDataRow = {
        label: 'Total Amount:',
        value: _order['total_amount']
      }
      IInvoiceResultData.push(_row);
    }
    if (isValidNumber(_order['discount'])) {
      const _row: IInvoiceResultDataRow = {
        label: 'Discount:',
        value: _order['discount']
      }
      IInvoiceResultData.push(_row);
    }
    if (isValidNumber(_order['net_amount'])) {
      const _row: IInvoiceResultDataRow = {
        label: 'Amount Payable:',
        value: _order['net_amount']
      }
      IInvoiceResultData.push(_row);
    }
    if (isValidNumber(_order['credit_balance'])) {
      const _row: IInvoiceResultDataRow = {
        label: 'Credit Balance:',
        value: _order['credit_balance']
      }
      IInvoiceResultData.push(_row);
    }

    const data: IInvoice = {
      invoiceHeader: invoiceHeaderData,
      invoiceContractData: invoiceContractData,
      invoiceDataTable: invoiceData,
      invoiceResultTable: IInvoiceResultData,
    }

    return data;
  }

  async createCustomerInvoice(order_id: string): Promise<any> {
    const data: IInvoice = await this.genInvoiceData(order_id);
    const invoice = new PDFInvoiceGenerator(data);
    return await invoice.createInvoice();
  }

  async SendInvoiceEmail(sendInvoiceTo: sendInvoiceDTO) {
    const { order_id, receivers } = sendInvoiceTo;
    const _receivers: string[] = receivers.split(',');
    _receivers.map(receiver => {
      return receiver.trim()
    });

    const _order: any = await this.realEstateOrderRepository.findOne({
      relations: ['applyCoupons', 'property_location', 'property_coverage_type', 'property_type'],
      where: {
        order_id: order_id
      }
    }).catch((err: any) => {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
    const attachment = await this.createCustomerInvoice(order_id);
    _order['order_date'] = convertFDY(_order.created_at);
    _order['attachment'] = attachment['filename'];
    _order['co_type_name'] = "";
    _order['co_type_name'] = _order?.property_coverage_type?.type_name;
    _order['location_name'] = "";
    _order['location_name'] = _order?.property_location?.location_name;
    _order['question_name'] = "";
    _order['question_name'] = _order?.property_type?.question_name;
    for (const key in _order) {
      _order[key] = processString(_order[key]);
      if (key == "prop_city" && _order[key] != '') _order[key] = ', ' + _order[key];
      if (key == "prop_state" && _order[key] != '') _order[key] = ', ' + _order[key];
      if (key == "prop_zipcode" && _order[key] != '') _order[key] = ', ' + _order[key];
    }

    let receiver_emails: string[] = [];
    if (_receivers.includes("The Buyer") && _order.buyer_email != '') {
      receiver_emails.push(_order.buyer_email)
    }
    if (_receivers.includes("The Buyer's Agent") && _order.buyer_agentemail != '') {
      receiver_emails.push(_order.buyer_agentemail)
    }
    if (_receivers.includes("The Buyer's Coordinator") && _order.buyer_coordinatoremail != '') {
      receiver_emails.push(_order.buyer_coordinatoremail)
    }
    if (_receivers.includes("The Seller") && _order.seller_email != '') {
      receiver_emails.push(_order.seller_email)
    }
    if (_receivers.includes("The Seller's Agent") && _order.seller_agentemail != '') {
      receiver_emails.push(_order.seller_agentemail)
    }
    if (_receivers.includes("The Seller's Coordinator") && _order.seller_coordinatoremail != '') {
      receiver_emails.push(_order.seller_coordinatoremail)
    }
    if (_receivers.includes("The Closing Officer") && _order.closing_officeremail != '') {
      receiver_emails.push(_order.closing_officeremail)
    }
    if (_receivers.includes("The Escrow Assistant") && _order.escrow_assistantemail != '') {
      receiver_emails.push(_order.escrow_assistantemail)
    }

    const admin_emails = configuration().adminEmails;
    const configAdmin = {
      receiver: admin_emails,
      template: EmailTemplate.REALESTATE_INVOICE_ADMIN_EMAIL,
      data: JSON.stringify(_order)
    }
    const configClient = {
      receiver: receiver_emails,
      template: EmailTemplate.REALESTATE_INVOICE_CLIENT_EMAIL,
      data: JSON.stringify(_order)
    }
    const awsSesConfig = this.configService.get('awsSes');
    const sendEmail = useSendEmail(awsSesConfig);
    sendEmail(configAdmin);
    sendEmail(configClient);
  }

  async sendDailyOrderReport() {
    const today = (new Date()).toISOString().substring(0, 10);
    let _tmr = new Date(today)
    _tmr.setDate(_tmr.getDate() + 1)
    const tmr = _tmr.toISOString().substring(0, 10);
    const _orders: any = await this.realEstateOrderRepository.find({
      relations: ['property_location', 'property_coverage_type', 'property_type'],
      where: {
        created_at: Between(today, tmr)
      }
    }).catch((err: any) => {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
    //admin email addresses
    const admin_emails = configuration().adminEmails;

    const fileName = 'real_order_report_' + today + '.csv';
    const createCsvWriter = require('csv-writer').createArrayCsvWriter;
    const columnNames = [
      'Order ID',
      'Location Name', 'Coverage Type', 'Property Type', 'Order Person',
      'Property Street',
      'Property City',
      'Property State',
      'Property Zip Code',
      'Buyer Name', 'Buyer Phone', 'Buyer Email', 'Buyer AgentName', 'Buyer AgentPhone', 'Buyer AgentEmail', 'Buyer RealStateCompany', 'Buyer CoordinatorName', 'Buyer CoordinatorPhone', 'Buyer CoordinatorEmail', 'Seller Name', 'Seller Phone', 'Seller Email', 'Seller AgentName', 'Seller AgentPhone', 'Seller AgentEmail', 'Seller RealStateCompany', 'Seller CoordinatorName', 'Seller CoordinatorPhone', 'Seller CoordinatorEmail', 'Escrow Title', 'Escrow Street', 'Escrow City', 'Escrow State', 'Escrow Zipcode', 'Closing OfficerName', 'Closing OfficerEmail', 'Closing OfficerPhone', 'Closing Date', 'Escrow AssistantName', 'Escrow AssistantEmail', 'Order Biller', 'Order Notes', 'Sales Person', 'Coupon Code', 'Total Amount', 'Net Amount', 'Credit Balance', 'Order Status'
    ];

    const csvWriter = createCsvWriter({
      path: 'public/report/' + fileName,
      header: columnNames
    });

    const csvRecords: any[] = [];
    _orders.forEach((order) => {
      const row = [
        processString(order.order_id),
        processString(order.property_location.location_name),
        processString(order.property_coverage_type.type_name),
        processString(order.property_type.property_name),
        processString(order.i_am_the),
        processString(order.prop_street1 + ' ' + order.prop_street2),
        processString(order.prop_city),
        processString(order.prop_state),
        processString(order.prop_zipcode),
        processString(order.buyer_name),
        processString(order.buyer_phone),
        processString(order.buyer_email),
        processString(order.buyer_agentname),
        processString(order.buyer_agentphone),
        processString(order.buyer_agentemail),
        processString(order.buyer_realstate_company),
        processString(order.buyer_coordinatorname),
        processString(order.buyer_coordinatorphone),
        processString(order.buyer_coordinatoremail),
        processString(order.seller_name),
        processString(order.seller_phone),
        processString(order.seller_email),
        processString(order.seller_agentname),
        processString(order.seller_agentphone),
        processString(order.seller_agentemail),
        processString(order.seller_realstate_company),
        processString(order.seller_coordinatorname),
        processString(order.seller_coordinatorphone),
        processString(order.seller_coordinatoremail),
        processString(order.escrow_title),
        processString(order.escrow_street1 + ' ' + order.escrow_street2),
        processString(order.escrow_city),
        processString(order.escrow_state),
        processString(order.escrow_zipcode),
        processString(order.closing_officername),
        processString(order.closing_officeremail),
        processString(order.closing_officerphone),
        processString(order.closing_date),
        processString(order.escrow_assistantname),
        processString(order.escrow_assistantemail),
        processString(order.order_biller),
        processString(order.order_notes),
        processString(order.sales_person),
        processString(order.coupon_code),
        processString(order.total_amount),
        processString(order.net_amount),
        processString(order.credit_balance),
        processString(order.order_status)
      ];
      csvRecords.push(row);

    });

    await csvWriter.writeRecords(csvRecords)       // returns a promise
      .then(() => {
        console.log('...Done');
      });

    const config = {
      receiver: admin_emails,
      template: EmailTemplate.REALESTATE_DAILY_REPORT_EMAIL,
      data: `"today":"${today}", "attachment":"${fileName}","domain":"${configuration().domain}"`
    }
    const awsSesConfig = this.configService.get('awsSes');
    const sendEmail = useSendEmail(awsSesConfig);
    sendEmail(config);

  }


  async getStates() {
    const _locations = await getRepository(RealLocation).find();
    return _locations;
  }

  async getCovType() {
    const _locations = await getRepository(RealCoverageType).find();
    return _locations;
  }

  async getQuestions(getQuestion: GetQuestionDTO) {
    const w1 = {
      location: getQuestion.state_id,
      coverage_type: getQuestion.cov_type_id,
    }
    const w2 = {
      location: getQuestion.state_id,
      coverage_type: getQuestion.cov_type_id,
      question_type: getQuestion.property_type,
    }
    const w = getQuestion.property_type ? w2 : w1;
    const property_types: any[] = await getRepository(RealRelationship).find({
      relations: ['question_type'],
      where: w
    });
    if (property_types.length == 0) {
      throw new HttpException(
        'No Question Found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    for (const pt of property_types) {
      const property_type = pt.question_type['property_id'];
      const qinfo = await getRepository(RealProQsRelationship).find({
        relations: ['question'],
        where: {
          location: getQuestion.state_id,
          coverage_type: getQuestion.cov_type_id,
          property_type: property_type
        }
      });

      if (qinfo.length) {
        const question_info = [];
        let i = 0;
        for await (const q of qinfo) {
          const qi = q.question;
          question_info[i] = {};
          question_info[i]['question_id'] = qi['real_pro_id']
          question_info[i]['question_name'] = qi['question']
          if (qi['input_type'] == 'radio') {
            question_info[i]['options'] = [];
            const valid_options = qi['valid_options'].split(',');
            if (valid_options.length) {
              let j = 0;
              for await (const vo of valid_options) {
                question_info[i]['options'][j] = {};
                question_info[i]['options'][j][qi['input_name']] = vo;

                const qr_info = await getRepository(RealQuestionRelationship).findOne({
                  where: {
                    location: getQuestion.state_id,
                    coverage_type: getQuestion.cov_type_id,
                    property_type: property_type,
                    question_value: qi['default_value']
                  }
                });
                if (qr_info) {
                  if (qr_info['question_value'] == vo) {
                    question_info[i]['options'][j]['selected'] = true;
                  }
                  else {
                    question_info[i]['options'][j]['selected'] = false;
                  }
                }
                else {
                  if (qi['default_value'] == vo) {
                    question_info[i]['options'][j]['selected'] = true;
                  }
                  else {
                    question_info[i]['options'][j]['selected'] = false;
                  }
                }
                j++;
              };
            }

          }
          else if (qi['input_type'] == 'text') {
            question_info[i]['value'] = qi['default_value'];
          }
          i++;
        };
        pt['pt_questions'] = question_info;
      }
    };

    return property_types;
  }

  async getProducts(getProduct: GetProductDTO) {
    const questions = getProduct?.questions;
    let prodarray = [];
    if (questions != null && questions.length) {
      let common_products = [];
      for (const question of questions) {
        const relation_products = await getRepository(RealQuestionRelationship).find({
          location: getProduct.state_id,
          coverage_type: getProduct.cov_type_id,
          property_type: getProduct.property_type,
          question: question.question_id,
          question_value: question.question_value
        });
        if (relation_products.length) {
          relation_products.forEach(product => {
            common_products = [...common_products, ...product.products.split(',')].sort();
          });
        }
      }

      if (common_products.length) {
        for await (const pro_id of common_products) {
          const productinfo: any = await getRepository(RealProduct).findOne({
            where: {
              product_id: pro_id
            }
          });
          // Features for Location
          const features = await getRepository(RealProductFeature).find({
            where: {
              location: getProduct.state_id
            }
          });
          // Features of Product
          let product_features = [];
          let pi = 0;
          for await (const f of features) {
            const pro_features = await getRepository(RealProductFeatureRelationship).find({
              where: {
                product: pro_id,
                product_feature: f.product_feature_id
              }
            });
            product_features[pi] = {};
            product_features[pi]['key'] = f.product_feature_id;
            if (pro_features.length) product_features[pi]['value'] = 'Yes';
            else product_features[pi]['value'] = 'No';
            pi++;
          }
          productinfo['feauture'] = product_features;
          prodarray.push(product_features);
        }
      }
    }
    else {
      const relation_products = await getRepository(RealRelationship).find({
        where: {
          location: getProduct.state_id,
          coverage_type: getProduct.cov_type_id,
          question_type: getProduct.property_type
        }
      });
      if (relation_products.length) {
        for (const rp of relation_products) {
          const ids = rp.product_ids.split(',').sort();
          for (const pro_id of ids) {
            const productinfo = getRepository(RealProduct).findOne({
              where: {
                product_id: pro_id
              }
            });
            let pro_features = [];
            const features = await getRepository(RealProductFeature).find({
              where: {
                location: getProduct.state_id
              }
            });
            let product_features = []
            let pi = 0;
            for (const f of features) {
              const pro_features = await getRepository(RealProductFeatureRelationship).find({
                where: {
                  product: pro_id,
                  product_feature: f.product_feature_id
                }
              });
              product_features[pi] = {};
              product_features[pi]['key'] = f.product_feature_id;
              if (pro_features.length) product_features[pi]['value'] = 'Yes';
              else product_features[pi]['value'] = 'No';
              pi++;
            }
            prodarray.push(productinfo);
          }
        }
      }
    }
    if (prodarray.length) {
      return {
        "result": true,
        "products": prodarray,
        "status": HttpStatus.CREATED
      }
    }
    return {
      "result": false,
      "products": prodarray,
      "status": HttpStatus.UNPROCESSABLE_ENTITY
    }

  }

  async getLocationFeatures(state_id: string) {
    const features = await getRepository(RealProductFeature).find({
      location: state_id
    });
    if (isNotEmpty(features)) {
      return {
        "result": true,
        "features": features,
        "status": HttpStatus.CREATED
      };
    }
    else {
      return {
        "result": false,
        "message": "No Feature Found",
        "status": HttpStatus.UNPROCESSABLE_ENTITY
      }
    }
  }


  async getRealstateFeatures(location_id: string) {
    return await getRepository(RealFeatureTitle).find({
      relations: ['location', 'features'],
      where: {
        location: location_id
      }
    });
  }

  async getProductCoverage(prod_id: string) {
    const coverage_upgrades = await getRepository(RealCoverage).find({
      product_id: prod_id
    });
    if (coverage_upgrades.length) {
      let newupgrades = []
      coverage_upgrades.forEach(upgrade => {
        upgrade['quantity'] = 0;
        if (upgrade.coverage_type == 'default') upgrade['quantity'] = 1
        newupgrades.push(upgrade)
      });
      return {
        result: true,
        coverage_upgrades: newupgrades,
        status: HttpStatus.CREATED
      }
    }
    return {
      result: true,
      message: "No Product Coverage Found",
      status: HttpStatus.UNPROCESSABLE_ENTITY
    }
  }

  async getUserTypes() {
    const user_types = await getRepository(RealUserType).find();
    return {
      result: true,
      user_types: user_types,
      status: HttpStatus.CREATED
    }
  }

  async testInvoice(testInvoice: testInvoiceDTO) {

    const _order = testInvoice;

    const data: IInvoice = await this.testGenInvoiceData(testInvoice);
    const invoice = new PDFInvoiceGenerator(data);
    const attachment = await invoice.createInvoice();

    _order['order_date'] = convertFDY(new Date(_order.created_at));
    _order['attachment'] = attachment['filename'];
    _order['domain'] = configuration().domain;
    for (const key in _order) {
      _order[key] = processString(_order[key]);
      if (key == "prop_city" && _order[key] != '') _order[key] = ', ' + _order[key];
      if (key == "prop_state" && _order[key] != '') _order[key] = ', ' + _order[key];
      if (key == "prop_zipcode" && _order[key] != '') _order[key] = ', ' + _order[key];
    }

    const admin_emails = configuration().adminEmails;
    const configAdmin = {
      receiver: _order.test_your_email,
      template: EmailTemplate.REALESTATE_INVOICE_ADMIN_EMAIL,
      data: JSON.stringify(_order)
    }
    const configClient = {
      receiver: _order.test_your_email,
      template: EmailTemplate.REALESTATE_INVOICE_CLIENT_EMAIL,
      data: JSON.stringify(_order)
    }
    const awsSesConfig = this.configService.get('awsSes');
    const sendEmail = useSendEmail(awsSesConfig);
    sendEmail(configAdmin);
    return sendEmail(configClient);
  }

  async testGenInvoiceData(_order: testInvoiceDTO): Promise<any> {
    _order['order_date'] = convertFDY(new Date(_order.created_at));
    const invoice_number = _order.order_id.padStart(8, '0');
    let name = [];
    switch (_order.order_biller) {
      case "The Seller":
        _order['email'] = _order.seller_email;
        _order['company'] = _order.seller_realstate_company;
        _order['phone'] = _order.seller_phone;
        name = _order.seller_name?.split(' ')
        break;
      case "The Seller's Agent":
        _order['email'] = _order.seller_agentemail;
        _order['company'] = _order.seller_realstate_company;
        _order['phone'] = _order.seller_agentphone;
        name = _order.seller_agentname?.split(' ')
        break;
      case "The Buyer":
        _order['email'] = _order.buyer_email;
        _order['company'] = _order.buyer_realstate_company;
        _order['phone'] = _order.buyer_phone;
        name = _order.buyer_name?.split(' ')
        break;
      case "The Buyer's Agent":
        _order['email'] = _order.buyer_agentemail;
        _order['company'] = _order.buyer_realstate_company;
        _order['phone'] = _order.buyer_agentphone;
        name = _order.buyer_agentname?.split(' ')
        break;
      default:
        break;
    }
    if (typeof name !== 'undefined' && typeof name[0] !== 'undefined') {
      _order['firstname'] = name[0];
    }
    else {
      _order['firstname'] = "";
    }
    if (typeof name !== 'undefined' && typeof name[1] !== 'undefined') {
      _order['lastname'] = name[1];
    }
    else {
      _order['lastname'] = '';
    }

    _order['street1'] = "";
    _order['street2'] = "";
    _order['city'] = "";
    _order['state'] = "";
    _order['pincode'] = "";

    const _orderItems: any = JSON.parse(_order._orderItems);
    const invoiceHeaderData: IInvoiceHeaderData = {
      order_date: _order['order_date'],
      invoice_number: invoice_number,
      location_name: _order.location_name,
      co_type_name: _order.co_type_name,
      order_biller: _order.order_biller,
      sales_person: _order.sales_person
    }

    const invoiceContractData: IInvoiceContractData = {
      prop_street1: _order['prop_street1'],
      prop_street2: _order['prop_street2'],
      prop_city: _order['prop_city'],
      prop_state: _order['prop_state'],
      prop_zipcode: _order['prop_zipcode'],
      closing_date: _order['closing_date'],
      buyer_name: _order['buyer_name'],
      buyer_email: _order['buyer_email'],
      buyer_phone: _order['buyer_phone'],
      seller_name: _order['buyer_phone'],
      seller_email: _order['buyer_phone'],
      seller_phone: _order['seller_phone'],
      escrow_title: _order['escrow_title'],
      escrow_street1: _order['escrow_street1'],
      escrow_street2: _order['escrow_street2'],
      escrow_city: _order['escrow_city'],
      escrow_state: _order['escrow_state'],
      escrow_zipcode: _order['escrow_zipcode'],
      buyer_agentname: _order['buyer_agentname'],
      buyer_agentemail: _order['buyer_agentemail'],
      buyer_agentphone: _order['buyer_agentphone'],
      seller_agentname: _order['seller_agentname'],
      seller_agentemail: _order['seller_agentemail'],
      seller_agentphone: _order['seller_agentphone'],
      closing_officername: _order['closing_officername'],
      closing_officeremail: _order['closing_officeremail'],
      closing_officerphone: _order['closing_officerphone'],
      escrow_assistantname: _order['escrow_assistantname'],
      escrow_assistantemail: _order['escrow_assistantemail'],
    }

    let invoiceData: any = [];
    _orderItems.forEach(item => {
      const iInvoiceDataTableRow: IInvoiceDataTableRow = {
        date: convertFDY(new Date(item.date)),
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        line_total: item.line_total,
      }
      invoiceData.push(iInvoiceDataTableRow);
    });

    let IInvoiceResultData: any = [];
    if (_order['total_amount'] != "") {
      const _row: IInvoiceResultDataRow = {
        label: 'Total Amount:',
        value: _order['total_amount']
      }
      IInvoiceResultData.push(_row);
    }
    if (_order['discount'] != "") {
      const _row: IInvoiceResultDataRow = {
        label: 'Discount:',
        value: _order['discount']
      }
      IInvoiceResultData.push(_row);
    }
    if (_order['net_amount'] != "") {
      const _row: IInvoiceResultDataRow = {
        label: 'Amount Payable:',
        value: _order['net_amount']
      }
      IInvoiceResultData.push(_row);
    }
    if (_order['credit_balance'] != "") {
      const _row: IInvoiceResultDataRow = {
        label: 'Credit Balance:',
        value: _order['credit_balance']
      }
      IInvoiceResultData.push(_row);
    }


    const data: IInvoice = {
      invoiceHeader: invoiceHeaderData,
      invoiceContractData: invoiceContractData,
      invoiceDataTable: invoiceData,
      invoiceResultTable: IInvoiceResultData,
    }
    return data;
  }
}
