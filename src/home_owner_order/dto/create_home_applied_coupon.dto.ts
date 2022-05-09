import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber
} from 'class-validator';
export class CreateHomeAppliedCouponDTO {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  home_order_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  coupon_code: string;

  @ApiProperty()
  @IsNumber()
  discount: string;

}
