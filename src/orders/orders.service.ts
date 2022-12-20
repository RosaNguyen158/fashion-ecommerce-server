import { Injectable } from '@nestjs/common';
import { CartDetailsRepository } from 'src/carts/cartdetails.repository';
import { User } from 'src/users/entities/user.entity';
import { Order } from './entities/order.entity';
import { PaymentMethod } from './enum/payment-methods-enum';
import { PaymentStatus } from './enum/payment-status-enum';
import { OrderDetailsRepository } from './orderDetails.repository';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private OrdersRepository: OrdersRepository,
    private cartDetailsRepository: CartDetailsRepository,
    private OrderDetailsRepository: OrderDetailsRepository,
  ) {}

  async createOrder(
    user: User,
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus,
    listCartDetails: string[],
  ): Promise<Order> {
    let totalOrder = { total: 0, quantity: 0 };
    console.log(listCartDetails);

    if (listCartDetails.length > 1) {
      totalOrder = await listCartDetails.reduce(async (total, value) => {
        const { cartDetail, product } =
          await this.cartDetailsRepository.findCartDetail(value);
        const totalPrice = 0;
        const totalQuantity = 0;
        return {
          total: totalPrice + Number(product.price),
          quantity: totalQuantity + Number(cartDetail.quantity),
        };
      }, Promise.resolve({ total: 0, quantity: 0 })); // To use async in reduce
    } else {
      const { cartDetail, product } =
        await this.cartDetailsRepository.findCartDetail(listCartDetails[0]);
      totalOrder.total = product.price;
      totalOrder.quantity = cartDetail.quantity;
    }

    const newOrder = await this.OrdersRepository.createOrder(
      user,
      paymentMethod,
      paymentStatus,
      totalOrder.total,
    );

    Object.values(listCartDetails).map(async (value) => {
      const { cartDetail, product } =
        await this.cartDetailsRepository.findCartDetail(value);
      const result = await this.OrderDetailsRepository.createOrderDetail(
        product,
        newOrder,
        cartDetail.quantity,
      );
      console.log('result', result);
    });

    const order = await this.OrdersRepository.findOrder(newOrder.id);
    return order;
  }
}
