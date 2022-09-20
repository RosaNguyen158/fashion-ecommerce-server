import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Cart } from 'src/carts/entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from './entities/order-detail.entitty';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderDetailsRepository {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailsRepository: Repository<OrderDetail>,
  ) {}

  async createOrderDetail(product: Product, order: Order) {
    const newOrderDetail = await this.orderDetailsRepository.create({
      product: product,
      order: order,
    });
    try {
      await this.orderDetailsRepository.save(newOrderDetail);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
