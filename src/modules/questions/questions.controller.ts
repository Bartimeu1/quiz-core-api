import { Controller } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateQuestionDto, CountCorrectAnswersDto } from './dto';
import { wrapResponse } from '../../utils/wrap-response';

@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @MessagePattern('get-questions')
  async getTestQuestions(@Payload() testId: string) {
    const questions = await this.questionsService.getTestQuestions(testId);

    return { questions };
  }

  @MessagePattern('get-public-questions')
  async getPublicQuestions(@Payload() testId: string) {
    return await this.questionsService.getPublicTestQuestions(testId);
  }

  @MessagePattern('create-question')
  async createQuestion(@Payload() createQuestionDto: CreateQuestionDto) {
    const question =
      await this.questionsService.createQuestion(createQuestionDto);

    return wrapResponse(question);
  }

  @MessagePattern('delete-question')
  async deleteQuestion(@Payload() id: string) {
    await this.questionsService.deleteQuestion(id);
  }

  @MessagePattern('count-correct-answers')
  async countCorrectAnswers(
    @Payload() countCorrectAnswersDto: CountCorrectAnswersDto,
  ) {
    const { answers } = countCorrectAnswersDto;

    return this.questionsService.countCorrectAnswers(answers);
  }
}
