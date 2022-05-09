import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRealOrderItemDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  prod_type: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: Number;


  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  rate: Number;

}