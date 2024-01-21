import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { EVENTS } from '../shared/const/messaging.constants';
import { Controller } from '@nestjs/common';
import { OrderMessageConsumerService } from './order-message-consumer.service';

@Controller()
export class OrderMessageConsumerController {
  constructor(private orderMessageService: OrderMessageConsumerService) {}
  @MessagePattern(EVENTS.ORDER_CREATED_EVENT)
  async handleOrderCreated(
    @Payload() orderData: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    console.log('Message Received');
    if (!orderData) return;
    await this.orderMessageService.handleOrderCreated(orderData, context);
  }
}
