import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { QUEUES } from './shared/const/messaging.constants';
import { OrderMessageConsumerModule } from './order-message-consumer/order-message-consumer.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(OrderMessageConsumerModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://127.0.0.1'],
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
