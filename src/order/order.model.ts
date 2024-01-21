import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({
    type: {
      customerId: MongooseSchema.Types.ObjectId,
      name: String,
      email: String,
      _id: false,
    },
  })
  customer: {
    customerId: MongooseSchema.Types.ObjectId;
    name: string;
    email: string;
  };

  @Prop({
    type: {
      productId: MongooseSchema.Types.ObjectId,
      name: String,
      description: String,
      price: Number,
      stock: Number,
      _id: false,
    },
  })
  product: {
    productId: MongooseSchema.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    stock: number;
  };

  @Prop()
  quantity: number;

  @Prop({ default: 'created' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
