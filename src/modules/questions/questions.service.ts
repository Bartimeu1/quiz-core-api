import { Injectable, BadRequestException } from '@nestjs/common';

import { CreateQuestionDto, PublicQuestionDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from '../../schemas/question.schema';
import { Model, Types, isValidObjectId } from 'mongoose';

import { plainToInstance } from 'class-transformer';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async createQuestion(createQuestionDto: CreateQuestionDto) {
    const { id, ...questionData } = createQuestionDto;

    const question = new this.questionModel({
      ...questionData,
      test: new Types.ObjectId(id),
    });

    return question.save();
  }

  async getTestQuestions(testId: string): Promise<Question[]> {
    return this.questionModel.find({ test: new Types.ObjectId(testId) }).exec();
  }

  async getPublicTestQuestions(testId: string): Promise<PublicQuestionDto[]> {
    const questions = await this.getTestQuestions(testId);
    const plainQuestions = questions.map((doc) => doc.toJSON());

    return plainToInstance(PublicQuestionDto, plainQuestions);
  }

  async deleteQuestion(id: string) {
    if (!isValidObjectId(id)) {
      throw new RpcException(
        new BadRequestException(`Invalid MongoDB ObjectId: ${id}`),
      );
    }

    await this.questionModel.findByIdAndDelete(id).exec();
  }

  async deleteQuestionsByTestId(testId: string) {
    await this.questionModel
      .deleteMany({ test: new Types.ObjectId(testId) })
      .exec();
  }

  async countCorrectAnswers(
    answers: { questionId: string; answer: string[] }[],
  ) {
    const results = await Promise.all(
      answers.map(({ questionId: id, answer }) => this.checkAnswer(id, answer)),
    );
    const correctAnswers = results.filter((result) => result).length;

    return correctAnswers;
  }

  async checkAnswer(id: string, answer: string[]): Promise<boolean> {
    const question = await this.questionModel.findById(id).exec();
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
