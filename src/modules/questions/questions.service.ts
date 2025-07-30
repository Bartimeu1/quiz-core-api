import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { TestsService } from '../tests/tests.service';
import { CreateQuestionDto, PublicQuestionDto } from './dto';

import { plainToInstance } from 'class-transformer';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private testsService: TestsService,
  ) {}

  async createQuestion(createQuestionDto: CreateQuestionDto) {
    const { id, ...questionData } = createQuestionDto;

    const test = await this.testsService.getTestById(id);
    const question = this.questionRepository.create({ ...questionData, test });

    return await this.questionRepository.save(question);
  }

  async getTestQuestions(testId: number): Promise<Question[]> {
    const test = await this.testsService.getTestById(testId);

    return await this.questionRepository.find({ where: { test } });
  }

  async getPublicTestQuestions(testId: number): Promise<PublicQuestionDto[]> {
    const questions = await this.getTestQuestions(testId);

    return plainToInstance(PublicQuestionDto, questions);
  }

  async deleteQuestion(id: number) {
    await this.questionRepository.delete({ id });
  }

  async deleteQuestionsByTestId(testId: number) {
    const test = await this.testsService.getTestById(testId);
    await this.questionRepository.delete({ test });
  }

  async countCorrectAnswers(
    answers: { questionId: number; answer: string[] }[],
  ) {
    const results = await Promise.all(
      answers.map(({ questionId: id, answer }) => this.checkAnswer(id, answer)),
    );

    const correctAnswers = results.filter((result) => result).length;
    return correctAnswers;
  }

  async checkAnswer(id: number, answer: string[]): Promise<boolean> {
    const question = await this.questionRepository.findOneBy({ id });
    const correctAnswer = question?.correctAnswers;

    if (!correctAnswer) {
      return false;
    }

    const sortedUserAnswer = [...answer].sort();
    const sortedCorrectAnswer = [...correctAnswer].sort();

    if (sortedUserAnswer.length !== sortedCorrectAnswer.length) {
      return false;
    }

    return sortedUserAnswer.every(
      (answer, index) => answer === sortedCorrectAnswer[index],
    );
  }
}
