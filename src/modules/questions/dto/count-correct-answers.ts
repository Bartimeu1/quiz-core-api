import {
  IsString,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class AnswerItem {
  @IsString()
  questionId: string;

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
  answers: { questionId: string; answer: string[] }[];
}
