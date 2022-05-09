import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  APIContracts as ApiContracts,
  APIControllers as ApiControllers,
  Constants as SDKConstants,
} from 'authorizenet';
import { isNotEmpty } from 'class-validator';
import { Response } from 'express';
import { EmailTemplate, useSendEmail } from 'src/shared/aws-ses.utils';
import {
  useContentfulDeliveryClient,
  useGetCoupons,
  Coupon,
} from 'src/shared/contentful';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ValidateCoupon } from './dto/validate-coupon.dto';
import { Transaction } from './transaction.entity';
import { BillInfo } from './type/bill-info.interface';
import { Card } from './type/card.interface';
import { Order } from './type/order.interface';
import { TransactionStatus } from './type/transaction-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private configService: ConfigService,
  ) {}

  public async chargeCreditCard(
    card: Card,
    order: Order,
    coupon: ValidateCoupon,
    billInfo: BillInfo,
    res: Response,
  ) {
    try {
      const createTransactionDto: CreateTransactionDto = {
        coupon: coupon.code,
        original_amount: order.amount,
        product_name: order.productName,
        status: TransactionStatus.INITIATED,
        invoice_number: order.invoiceNumber,
      };

      const transaction = await this.createTransaction(createTransactionDto);
      //
      // check if coupon is valid, apply the coupon
      //
      if (isNotEmpty(coupon.code)) {
        const validCoupon = await this.checkValidCoupon(coupon);

        if (validCoupon) {
          if (validCoupon.type === 'Fixed') {
            order.amount -= validCoupon.amount;
          } else if (validCoupon.type === 'Percent') {
            order.amount -= validCoupon.amount * order.amount;
          }
          if (order.amount < 0) order.amount = 0;

          order.amount = parseFloat(order.amount.toFixed(2));
        } else {
          await this.updateTransactionStatus({
            transactionId: transaction.transaction_id,
            transactionStatus: TransactionStatus.COUPON_INVALID,
          });
          throw new HttpException('Coupon is invalid', HttpStatus.BAD_REQUEST);
        }
      }
      const authorizeNetConfig = this.configService.get('authorizeNet');

      const merchantAuthenticationType =
        new ApiContracts.MerchantAuthenticationType();
      merchantAuthenticationType.setName(authorizeNetConfig.apiLoginKey);
      merchantAuthenticationType.setTransactionKey(
        authorizeNetConfig.transactionKey,
      );

      const creditCard = new ApiContracts.CreditCardType();
      creditCard.setCardNumber(card.cardNumber);
      creditCard.setExpirationDate(card.expirationDate);
      creditCard.setCardCode(card.cardCode);

      const paymentType = new ApiContracts.PaymentType();
      paymentType.setCreditCard(creditCard);

      const orderDetails = new ApiContracts.OrderType();
      orderDetails.setInvoiceNumber(order.invoiceNumber);
      orderDetails.setDescription(order.productDescription);

      const transactionRequestType = new ApiContracts.TransactionRequestType();
      transactionRequestType.setTransactionType(
        ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION,
      );
      transactionRequestType.setPayment(paymentType);
      transactionRequestType.setAmount(order.amount);
      transactionRequestType.setOrder(orderDetails);

      const createRequest = new ApiContracts.CreateTransactionRequest();
      createRequest.setMerchantAuthentication(merchantAuthenticationType);
      createRequest.setTransactionRequest(transactionRequestType);

      const ctrl = new ApiControllers.CreateTransactionController(
        createRequest.getJSON(),
      );

      // In product mode, set to production
      if (this.configService.get('isProd') === true) {
        //Defaults to sandbox
        ctrl.setEnvironment(SDKConstants.endpoint.production);
      }

      ctrl.execute(
        function () {
          const apiResponse = ctrl.getResponse();

          const response = new ApiContracts.CreateTransactionResponse(
            apiResponse,
          );

          let statusCode = 0;
          let message: any = {};

          if (response != null) {
            if (
              response.getMessages().getResultCode() ==
              ApiContracts.MessageTypeEnum.OK
            ) {
              statusCode = HttpStatus.OK;
              if (response.getTransactionResponse().getMessages() != null) {
                message.trasnactionId = response
                  .getTransactionResponse()
                  .getTransId();
                message.responseCode = response
                  .getTransactionResponse()
                  .getResponseCode();

                message.code = response
                  .getTransactionResponse()
                  .getMessages()
                  .getMessage()[0]
                  .getCode();
                message.description = response
                  .getTransactionResponse()
                  .getMessages()
                  .getMessage()[0]
                  .getDescription();
              } else {
                if (response.getTransactionResponse().getErrors() != null) {
                  statusCode = response
                    .getTransactionResponse()
                    .getErrors()
                    .getError()[0]
                    .getErrorCode();
                  message = response
                    .getTransactionResponse()
                    .getErrors()
                    .getError()[0]
                    .getErrorText();
                }
              }
            } else {
              if (
                response.getTransactionResponse() != null &&
                response.getTransactionResponse().getErrors() != null
              ) {
                statusCode = response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorCode();
                message = response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorText();
              } else {
                statusCode = response.getMessages().getMessage()[0].getCode();

                message = response.getMessages().getMessage()[0].getText();
              }
            }
          } else {
            message = 'Null Response.';
          }

          if (statusCode === HttpStatus.OK) {
            this.updateTransactionStatus({
              transactionId: transaction.transaction_id,
              transactionStatus: TransactionStatus.APPROVED,
              authorizeTransactionId: message.trasnactionId,
              paidAmount: order.amount,
            });
            res.status(HttpStatus.OK).json(message);
            this.notifyTransaction({
              customerEmail: billInfo.email,
              name: billInfo.first_name + ' ' + billInfo.last_name,
              productName: order.productName,
              coupon: coupon.code,
              amount: order.amount,
              invoiceNumber: order.invoiceNumber,
            });
          } else {
            this.updateTransactionStatus({
              transactionId: transaction.transaction_id,
              transactionStatus: TransactionStatus.FAILED,
            });
            res.status(HttpStatus.BAD_REQUEST).json({ statusCode, message });
          }
        }.bind(this),
      );
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  }

  /**
   * @description check if coupon is valid
   * @param coupon
   * @returns if valid returns coupon ,otherwise null
   */
  public async checkValidCoupon(
    coupon: ValidateCoupon,
  ): Promise<Coupon | null> {
    //
    // Get coupons from contentful headless
    //
    const contentfulClient = useContentfulDeliveryClient(
      this.configService.get('contentful'),
    );
    const getCoupons = await useGetCoupons(contentfulClient);
    const coupons: Array<Coupon> = (await getCoupons()) as Array<Coupon>;

    //
    // Check if coupon is valid
    //
    for (const couponIterator of coupons) {
      if (
        couponIterator.code === coupon.code &&
        couponIterator.products.includes(coupon.product) &&
        new Date() < new Date(couponIterator.expirationDate)
      ) {
        return couponIterator;
      }
    }

    return null;
  }

  public async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const existTransaction = await this.transactionRepo.findOne({
      where: {
        invoice_number: createTransactionDto.invoice_number,
      },
    });

    if (existTransaction) {
      throw new HttpException(
        'Transaction with the same invoice number exists',
        HttpStatus.CONFLICT,
      );
    }

    const newTransaction = this.transactionRepo.create({
      ...createTransactionDto,
      status: TransactionStatus.INITIATED,
    });

    return this.transactionRepo.save(newTransaction);
  }

  private async updateTransactionStatus({
    transactionId,
    transactionStatus,
    paidAmount,
    authorizeTransactionId,
  }: {
    transactionId: string;
    transactionStatus: TransactionStatus;
    paidAmount?: number;
    authorizeTransactionId?: string;
  }): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({
      where: {
        transaction_id: transactionId,
      },
    });

    if (!transaction) {
      throw new HttpException(
        'Transaction status update failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    transaction.status = transactionStatus;
    if (paidAmount) {
      transaction.paid_amount = paidAmount;
    }
    if (authorizeTransactionId) {
      transaction.authorize_transaction_id = authorizeTransactionId;
    }
    return this.transactionRepo.save(transaction);
  }

  private async notifyTransaction({
    customerEmail,
    name,
    productName,
    coupon,
    amount,
    invoiceNumber,
  }: {
    customerEmail: string;
    name: string;
    productName: string;
    coupon: string;
    amount: number;
    invoiceNumber: string;
  }) {
    const awsSesConfig = this.configService.get('awsSes');
    const sendEmail = useSendEmail(awsSesConfig);

    //
    // Send transaction notification to the customer
    //
    const data = {
      name: name,
      invoice_number: invoiceNumber,
      amount: amount,
      product_name: productName,
      coupon: coupon,
      date: new Date().toLocaleString(),
    };

    sendEmail({
      receiver: customerEmail,
      template: EmailTemplate.NOTIFY_TRANSACTION,
      data: JSON.stringify(data),
    });

    //
    // Send transaction notification to the agency too
    //

    const agency = this.configService.get('customerAgency');

    sendEmail({
      receiver: agency,
      template: EmailTemplate.NOTIFY_TRANSACTION,
      data: JSON.stringify(data),
    });
  }
}
