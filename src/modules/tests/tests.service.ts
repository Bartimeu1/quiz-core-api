import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './entities/test.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test) private testRepository: Repository<Test>,
  ) {}

  async getAllTests(): Promise<Test[]> {
    return this.testRepository.find();
  }

  async getTestById(id: number): Promise<Test> {
    const test = await this.testRepository.findOneBy({ id });

    if (!test) {
      throw new RpcException(
        new NotFoundException(`Test with id ${id} not found`),
      );
    }

    return test;
  }

  async createTest(createTestDto: CreateTestDto) {
    const test = this.testRepository.create(createTestDto);

    return await this.testRepository.save(test);
  }

  async deleteTest(id: number) {
    await this.testRepository.delete({ id });
  }
}
