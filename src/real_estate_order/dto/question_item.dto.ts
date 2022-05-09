import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class QuestionItemDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question_value: string;

}