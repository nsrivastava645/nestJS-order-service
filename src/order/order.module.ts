import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.model';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QUEUES, SERVICES } from '../shared/const/messaging.constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ClientsModule.register([
      {
        name: SERVICES.ORDER,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://127.0.0.1'],
          queue: QUEUES.ORDER_CREATED_QUEUE,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
