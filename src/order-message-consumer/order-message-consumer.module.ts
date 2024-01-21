import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderMessageConsumerController } from './order-message-consumer.controller';
import { OrderMessageConsumerService } from './order-message-consumer.service';
import { AppModule } from '../app/app.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [HttpModule, AppModule, OrderModule],
  controllers: [OrderMessageConsumerController],
  providers: [OrderMessageConsumerService],
})
export class OrderMessageConsumerModule {}
