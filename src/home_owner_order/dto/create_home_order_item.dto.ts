import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty
} from 'class-validator';

export class CreateHomeOrderItemDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  home_order_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product_type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  payinterval_type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quantity: string;

}
