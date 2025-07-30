import { Module } from '@nestjs/common';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './entities/test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Test])],
  controllers: [TestsController],
  providers: [TestsService],
  exports: [TestsService],
})
export class TestsModule {}
