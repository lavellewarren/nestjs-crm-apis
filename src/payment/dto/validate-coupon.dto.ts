import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateCoupon {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public code;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public product;
}
