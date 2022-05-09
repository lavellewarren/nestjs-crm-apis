import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetQuestionDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cov_type_id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  property_type: string;

}