import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CustomerDto {
  @IsNotEmpty()
  customerId: string;

  @IsNotEmpty()
  name: string;
}

class ProductDto {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => CustomerDto)
  @IsObject()
  customer: CustomerDto;

  @ValidateNested()
  @Type(() => ProductDto)
  @IsObject()
  product: ProductDto;

  @IsNotEmpty()
  quantity: number;
}
