import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { QUEUES } from './shared/const/messaging.constants';
import { OrderMessageConsumerModule } from './order-message-consumer/order-message-consumer.module';
import * as dotenv from 'dotenv';
const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: `${environment}.env` });

async function bootstrap() {
  const app = await NestFactory.createMicroservice(OrderMessageConsumerModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_CONN_STRING],
      queue: QUEUES.ORDER_CREATED_QUEUE,
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });
  await app.listen();
}

bootstrap();
