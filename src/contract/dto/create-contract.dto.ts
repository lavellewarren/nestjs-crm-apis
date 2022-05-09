import { ApiProperty } from '@nestjs/swagger';
import { IsCurrency, IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class CreateContractDto {
  @ApiProperty()
  @IsString()
  public company_name: string;

  @ApiProperty()
  @IsString()
  public contract_name: string;

  @ApiProperty()
  @IsPhoneNumber('US')
  public contract_number: string;

  @ApiProperty()
  @IsEmail()
  public contract_email: string;

  @ApiProperty()
  @IsString()
  public trade_services: string;

  @ApiProperty()
  @IsString()
  public service_areas: string;

  @ApiProperty()
  @IsCurrency()
  public hourly_rate: number;
}
