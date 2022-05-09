import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty
} from 'class-validator';
export class CheckHomeCouponDTO {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  coupon_code: string;

  @ApiProperty()
  @IsString()
  discount_type: string;

  @ApiProperty()
  @IsString()
  coupon_amount: string;

  @ApiProperty()
  @IsString()
  expiry_date: string;

}
