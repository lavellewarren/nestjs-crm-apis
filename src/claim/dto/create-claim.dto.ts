import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class CreateClaimDto {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsPhoneNumber('US')
  public phone_number: string;

  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  public street_address: string;

  @ApiProperty()
  @IsString()
  public city: string;

  @ApiProperty()
  @IsString()
  public state: string;

  @ApiProperty()
  @IsString()
  public zip_code: string;

  @ApiProperty()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  public is_emergency: boolean;

  /**
   * @description comma seperated contact methods
   * @example 'phone, email, text'
   */
  @ApiProperty()
  @IsString()
  public contact_methods: string;

  /**
   * @description comma seperated technicians
   * @example 'electrician, plumber, samsung, other'
   */
  @ApiProperty()
  @IsString()
  public technicians: string;
}
