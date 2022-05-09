import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { QuestionItemDTO } from './question_item.dto';

export class GetProductDTO {
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
  @IsNotEmpty()
  property_type: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  questions: QuestionItemDTO[];

}