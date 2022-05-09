import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class ContactRequestDto {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsPhoneNumber('US')
  public phone: string;

  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  public message: string;
}
