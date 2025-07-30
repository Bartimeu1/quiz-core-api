import { Controller } from '@nestjs/common';
import { TestsService } from './tests.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { wrapResponse } from '../../utils/wrap-response';

import { CreateTestDto } from './dto';

@Controller()
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @MessagePattern('get-all-tests')
  async getAllTests() {
    const tests = await this.testsService.getAllTests();

    return { tests };
  }

  @MessagePattern('get-test-by-id')
  async getTest(@Payload() id: number) {
    const test = await this.testsService.getTestById(id);

    return { test };
  }

  @MessagePattern('create-test')
  async createTest(@Payload() createTestDto: CreateTestDto) {
    const test = await this.testsService.createTest(createTestDto);

    return wrapResponse(test);
  }

  @MessagePattern('delete-test')
  async deleteTest(@Payload() id: number) {
    await this.testsService.deleteTest(id);
  }
}
