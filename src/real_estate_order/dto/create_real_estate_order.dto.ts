import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { TransactionStatus } from '../../global/type';

export class CreateRealEstateOrderDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    property_location: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    property_coverage_type: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    property_type: string;

    @ApiProperty()
    @IsString()
    i_am_the: string;

    @ApiProperty()
    @IsString()
    real_estate_role: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    prop_street1: string;

    @ApiProperty()
    @IsString()
    prop_street2: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    prop_city: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    prop_state: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    prop_zipcode: string;

    @ApiProperty()
    @IsString()
    buyer_name: string;

    @ApiProperty()
    @IsString()
    buyer_phone: string;

    @ApiProperty()
    @IsString()
    buyer_email: string;

    @ApiProperty()
    @IsString()
    buyer_agentname: string;

    @ApiProperty()
    @IsString()
    buyer_agentphone: string;

    @ApiProperty()
    @IsString()
    buyer_agentemail: string;

    @ApiProperty()
    @IsString()
    buyer_realstate_company: string;

    @ApiProperty()
    @IsString()
    buyer_coordinatorname: string;

    @ApiProperty()
    @IsString()
    buyer_coordinatorphone: string;

    @ApiProperty()
    @IsString()
    buyer_coordinatoremail: string;

    @ApiProperty()
    @IsString()
    seller_phone: string;

    @ApiProperty()
    @IsString()
    seller_email: string;

    @ApiProperty()
    @IsString()
    seller_agentname: string;

    @ApiProperty()
    @IsString()
    seller_realstate_company: string;

    @ApiProperty()
    @IsString()
    seller_coordinatorname: string;

    @ApiProperty()
    @IsString()
    seller_coordinatorphone: string;

    @ApiProperty()
    @IsString()
    seller_coordinatoremail: string;

    @ApiProperty()
    @IsString()
    escrow_title: string;

    @ApiProperty()
    @IsString()
    escrow_street1: string;

    @ApiProperty()
    @IsString()
    escrow_street2: string;

    @ApiProperty()
    @IsString()
    escrow_city: string;

    @ApiProperty()
    @IsString()
    escrow_state: string;

    @ApiProperty()
    @IsString()
    escrow_zipcode: string;

    @ApiProperty()
    @IsString()
    escrow_assistantname: string;

    @ApiProperty()
    @IsString()
    escrow_assistantemail: string;

    @ApiProperty()
    @IsString()
    closing_officername: string;

    @ApiProperty()
    @IsString()
    closing_officeremail: string;

    @ApiProperty()
    @IsString()
    closing_officerphone: string;

    @ApiProperty()
    @IsString()
    closing_date: string;

    @ApiProperty()
    @IsString()
    order_biller: string;

    @ApiProperty()
    @IsString()
    order_notes: string;

    @ApiProperty()
    @IsString()
    sales_person: string;

    @ApiProperty()
    @IsString()
    coupon_code: string;

    @ApiProperty()
    @IsNumber()
    total_amount: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    net_amount: number;

    @ApiProperty()
    @IsNumber()
    credit_balance: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    order_status: TransactionStatus;

    @ApiProperty()
    @IsString()
    transaction_date: Date;
}
