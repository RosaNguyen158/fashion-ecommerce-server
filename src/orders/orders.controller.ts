import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Controller('order')
@UseGuards(AuthGuard())
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('/create-order')
  async createOrder(
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<Order> {
    const createOrder = await this.ordersService.createOrder(
      user,
      req.body['paymentMethod'],
      req.body['paymentStatus'],
      req.body['cartId'],
    );
    return createOrder;
  }
}
