import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.model';
import { CreateOrderDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel(orderData);
    return order.save();
  }

  async updateOrderStatus(orderId: string, newStatus: string): Promise<Order> {
    return this.orderModel.findByIdAndUpdate(
      orderId,
      { $set: { status: newStatus, updatedAt: new Date() } },
      { new: true },
    );
  }

  async getOrderById(orderId: string): Promise<Order> {
    return this.orderModel.findById(orderId).exec();
  }

  async getOrders(): Promise<{ totalRecords: number; orders: Order[] }> {
    const [totalRecords, orders] = await Promise.all([
      this.orderModel.countDocuments(),
      this.orderModel.find(),
    ]);
    return {
      totalRecords,
      orders,
    };
  }
}
