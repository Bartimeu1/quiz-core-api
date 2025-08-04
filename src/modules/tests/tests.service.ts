import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Test } from '../../schemas/test.schema';
import { Model } from 'mongoose';

@Injectable()
export class TestsService {
  constructor(@InjectModel(Test.name) private testModel: Model<Test>) {}

  async getAllTests(): Promise<Test[]> {
    return this.testModel.find().exec();
  }

  async getTestById(id: number): Promise<Test> {
    const test = await this.testModel.findById(String(id)).exec();

    if (!test) {
      throw new RpcException(
        new NotFoundException(`Test with id ${id} not found`),
      );
    }

    return test;
  }

  async createTest(createTestDto: CreateTestDto) {
    const createdTest = new this.testModel(createTestDto);

    return createdTest.save();
  }

  async deleteTest(id: number) {
    await this.testModel.findByIdAndDelete(id).exec();
  }
}
