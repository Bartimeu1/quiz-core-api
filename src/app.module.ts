import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaClientModule } from './modules/kafka-client/kafka-client.module';
import { TestsModule } from './modules/tests/tests.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TestsModule,
    QuestionsModule,
    KafkaClientModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DATABASE'),
        auth: {
          username: configService.get<string>('MONGO_USERNAME'),
          password: configService.get<string>('MONGO_PASSWORD'),
        },
      }),
    }),
  ],
})
export class AppModule {}
