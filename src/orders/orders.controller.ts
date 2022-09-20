import { Controller, Post, Req } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Controller('order')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('/create-order')
  async createOrder(@Req() req: Request): Promise<Order> {
    const token = req.headers['authorization'].split(' ')[1];
    const createOrder = await this.ordersService.createOrder(
      token,
      req.body['paymentMethod'],
      req.body['paymentStatus'],
      req.body['productOrders'],
    );
    return createOrder;
  }
}
