import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { DEFAULT_KAFKA_HOST } from '../../constants/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CORE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'core-client',
            brokers: [process.env.KAFKA_HOST || DEFAULT_KAFKA_HOST],
          },
          consumer: {
            groupId: 'core-consumer-group',
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaClientModule {}
