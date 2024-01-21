import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Payload, RmqContext } from '@nestjs/microservices';
import {
  INTERNAL_URLS,
  MAX_RETRIES,
} from '../shared/const/messaging.constants';
import { AxiosError, AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { OrderService } from '../order/order.service';

@Injectable()
export class OrderMessageConsumerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly orderService: OrderService,
  ) {}
  async handleOrderCreated(
    @Payload() orderData: any,
    @Ctx() context: RmqContext,
  ): Promise<boolean> {
    if (!orderData) return;
    Logger.log('Message:', orderData);
    orderData = JSON.parse(orderData);
    const {
      order: {
        product: { productId },
        quantity,
        _id: orderId,
      },
      headers,
    } = orderData;
    const newHeaders = {
      Authorization: headers['authorization'],
    };
    return await this.decreaseStock(
      orderId,
      quantity,
      0,
      productId,
      newHeaders,
      context,
    );
  }

  async decreaseStock(
    orderId: string,
    quantity: number,
    retries: number,
    productId: string,
    headers: any,
    @Ctx() context: RmqContext,
  ): Promise<boolean> {
    if (retries === MAX_RETRIES) {
      //if max retries reached, cancel the order and respond with some notification
      this.orderService.updateOrderStatus(orderId, 'cancelled');
      return;
    } else {
      this.httpService
        .patch(
          `${INTERNAL_URLS.PRODUCT}/${productId}`,
          { quantity: -quantity },
          { headers },
        )
        .subscribe({
          next: (value: AxiosResponse) => {
            Logger.log(
              `Stock Adjusted Sucessfully, ${JSON.stringify(value.data)}`,
            );
            context.getChannelRef().ack(context.getMessage());
            return;
          },
          error: (value: AxiosError) => {
            //retry for 2 more times
            Logger.error(`Error: ${JSON.stringify(value.response.data)}`);
            if (value?.response?.status === 400) {
              this.decreaseStock(
                orderId,
                quantity,
                retries + 1,
                productId,
                headers,
                context,
              );
            }
          },
        });
    }
  }
}
