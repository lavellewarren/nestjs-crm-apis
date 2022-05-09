import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class testInvoiceDTO {
  @ApiProperty({ default: 'XYZ PROPERTY' })
  @IsString()
  prop_street1: string;

  @ApiProperty({ default: 'GWL IN 778767' })
  @IsString()
  prop_street2: string;

  @ApiProperty({ default: 'New York' })
  @IsString()
  prop_city: string;

  @ApiProperty({ default: 'New York' })
  @IsString()
  prop_state: string;

  @ApiProperty({ default: '01110' })
  @IsString()
  prop_zipcode: string;

  @ApiProperty({ default: 'Utah' })
  @IsString()
  location_name: string;

  @ApiProperty({ default: '13' })
  @IsString()
  order_id: string;

  @ApiProperty({ default: "Buyer's Coverage" })
  @IsString()
  co_type_name: string;

  @ApiProperty({ default: 'i am the' })
  @IsString()
  i_am_the: string;

  @ApiProperty({ default: '' })
  @IsString()
  question_name: string;

  @ApiProperty({ default: 'Ankit Agarwal' })
  @IsString()
  buyer_name: string;

  @ApiProperty({ default: 'jmbliss84@gmail.com' })
  @IsString()
  buyer_email: string;

  @ApiProperty({ default: '7974765569' })
  @IsString()
  buyer_phone: string;

  @ApiProperty({ default: 'Ankit Agarwal' })
  @IsString()
  buyer_agentname: string;

  @ApiProperty({ default: 'mbliss84@gmail.com' })
  @IsString()
  buyer_agentemail: string;

  @ApiProperty({ default: '7974765569' })
  @IsString()
  buyer_agentphone: string;

  @ApiProperty({ default: '' })
  @IsString()
  buyer_realstate_company: string;

  @ApiProperty({ default: 'ABCD' })
  @IsString()
  seller_name: string;

  @ApiProperty({ default: 'seller@mailinator.com' })
  @IsString()
  seller_email: string;

  @ApiProperty({ default: '' })
  @IsString()
  seller_realstate_company: string;

  @ApiProperty({ default: '5555444433' })
  @IsString()
  seller_phone: string;


  @ApiProperty({ default: 'Ankit Agarwal' })
  @IsString()
  seller_agentname: string;


  @ApiProperty({ default: 'jmbliss84@gmail.com' })
  @IsString()
  seller_agentemail: string;


  @ApiProperty({ default: '7974765569' })
  @IsString()
  seller_agentphone: string;


  @ApiProperty({ default: 'ESC COMPANY' })
  @IsString()
  escrow_title: string;


  @ApiProperty({ default: 'GWL IL' })
  @IsString()
  escrow_street1: string;


  @ApiProperty({ default: 'GWL IL' })
  @IsString()
  escrow_street2: string;

  @ApiProperty({ default: 'New York' })
  @IsString()
  escrow_city: string;

  @ApiProperty({ default: 'New York' })
  @IsString()
  escrow_state: string;

  @ApiProperty({ default: '10001' })
  @IsString()
  escrow_zipcode: string;

  @ApiProperty({ default: 'Ankit Agarwal' })
  @IsString()
  closing_officername: string;

  @ApiProperty({ default: 'jmbliss84@gmail.com' })
  @IsString()
  closing_officeremail: string;

  @ApiProperty({ default: '7974765569' })
  @IsString()
  closing_officerphone: string;

  @ApiProperty({ default: 'Ankit Agarwal' })
  @IsString()
  escrow_assistantname: string;

  @ApiProperty({ default: 'jmbliss84@gmail.com' })
  @IsString()
  escrow_assistantemail: string;

  @ApiProperty({ default: 'May 30, 2022' })
  @IsString()
  closing_date: string;

  @ApiProperty({ default: 'Buyer' })
  @IsString()
  order_biller: string;

  @ApiProperty({ default: '' })
  @IsString()
  order_notes: string;

  @ApiProperty({ default: 'Seller' })
  @IsString()
  sales_person: string;

  @ApiProperty({ default: '' })
  @IsString()
  coupon_code: string;

  @ApiProperty({ default: 'Dan@utahcreative.com' })
  @IsString()
  test_your_email: string;

  @ApiProperty({ default: "[{\"date\":\"June28,2021\",\"description\":\"AdditionalRefrigerator/Freezer\",\"quantity\":\"1\",\"rate\":40,\"line_total\":40},{\"date\":\"June28,2021\",\"description\":\"Standard\",\"quantity\":\"1\",\"rate\":300,\"line_total\":300}]" })
  @IsString()
  _orderItems: string;

  @ApiProperty({ default: '340' })
  @IsString()
  total_amount: string;

  @ApiProperty({ default: '' })
  @IsString()
  discount: string;

  @ApiProperty({ default: '' })
  @IsString()
  net_amount: string;

  @ApiProperty({ default: '' })
  @IsString()
  credit_balance: string;

  @ApiProperty()
  @IsString()
  created_at: Date;
}