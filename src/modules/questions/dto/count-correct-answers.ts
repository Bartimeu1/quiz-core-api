import {
  IsString,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class AnswerItem {
  @IsNumber()
  questionId: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  answer: string[];
}

export class CountCorrectAnswersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerItem)
  @ArrayNotEmpty()
  answers: { questionId: number; answer: string[] }[];
}
