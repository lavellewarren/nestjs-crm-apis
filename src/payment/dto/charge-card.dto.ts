import { ApiProperty } from '@nestjs/swagger';
import {
  IsCreditCard,
  IsCurrency,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  Length,
} from 'class-validator';

export class ChargeCardDto {
  //
  // Billing Details
  //
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public first_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public last_name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public company_name?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public bill_street: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public bill_apartment;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public bill_city;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public bill_state;

  @ApiProperty()
  @IsString()
  @IsPostalCode('any')
  public bill_zip_code;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber('US')
  public phone;

  @ApiProperty()
  @IsString()
  @IsEmail()
  public email;

  //
  // Warrantied Property Address
  //
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public warranty_street;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public warranty_apartment;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public warranty_city;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public warranty_state;

  @ApiProperty()
  @IsString()
  @IsPostalCode('any')
  public warranty_zip_code;

  //
  // order notes
  //
  @ApiProperty()
  @IsString()
  @IsOptional()
  public order_notes;

  //
  // Card Infos
  //
  @ApiProperty()
  @IsCreditCard()
  public card_number: string; // ex:4242424242424242

  @ApiProperty()
  @IsNumberString()
  @Length(4)
  public expiration_date: string; //ex: 12/24 => 1224

  @ApiProperty()
  @IsNumberString()
  @Length(3, 4)
  public card_code: string; // ex: 999

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public invoice_number: string;

  //
  // Product infos
  //
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public product_description: string;

  @ApiProperty()
  @IsCurrency()
  public amount: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public coupon: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public product_name: string; // ex: 'Real Estate' | 'Home Owner'
}
