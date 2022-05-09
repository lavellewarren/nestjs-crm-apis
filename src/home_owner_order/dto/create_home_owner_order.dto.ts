import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsDate,
    IsEnum,
    NotEquals,
} from 'class-validator';
import { TransactionStatus } from '../../global/type';

export class CreateHomeOwnerOrderDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty()
    @IsString()
    company: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    street1: string;

    @ApiProperty()
    @IsString()
    street2: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    state: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    pincode: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string;

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
    order_notes: string;

    @ApiProperty()
    @IsString()
    credit_balance: string;

    @ApiProperty()
    @IsString()
    coupon_code: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    subtotal: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    total: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    pay_method: string;

    @ApiProperty()
    // @IsEnum(TransactionStatus)
    @IsNotEmpty()
    status: TransactionStatus;

    @ApiProperty()
    @IsString()
    transaction_date: Date;
}
