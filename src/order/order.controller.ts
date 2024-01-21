import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Inject,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.model';
import { CreateOrderDto } from './order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { EVENTS, SERVICES } from '../shared/const/messaging.constants';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
export class OrderController {
  constructor(
    @Inject(SERVICES.ORDER) private readonly client: ClientProxy,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'user')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: Request,
  ) {
    const order = await this.orderService.createOrder(createOrderDto);
    this.client.emit(
      EVENTS.ORDER_CREATED_EVENT,
      JSON.stringify({ order, headers: request.headers }),
    );
    return { message: 'Order created successfully', order };
  }

  @Put(':id/update-status/:status')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'user', 'system')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Param('status') newStatus: string,
  ) {
    const order = await this.orderService.updateOrderStatus(orderId, newStatus);
    return { message: 'Order status updated successfully', order };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'user')
  async getOrderById(@Param('id') orderId: string) {
    const order = await this.orderService.getOrderById(orderId);
    return { message: 'Order retrieved successfully', order };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'user')
  async getOrders(): Promise<{ totalRecords: number; orders: Order[] }> {
    return await this.orderService.getOrders();
  }
}
