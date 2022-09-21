import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from 'src/auth/auth.repository';
import { CartDetailsRepository } from 'src/carts/cartdetails.repository';
import { CartsRepository } from 'src/carts/carts.repository';
import { ProductsRepository } from 'src/products/products.repository';
import { UserRepository } from 'src/users/users.repository';
import { Order } from './entities/order.entity';
import { PaymentMethod } from './enum/payment-methods-enum';
import { PaymentStatus } from './enum/payment-status-enum';
import { OrderDetailsRepository } from './orderDetails.repository';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(forwardRef(() => AuthRepository))
    @Inject(forwardRef(() => UserRepository))
    private authRepository: AuthRepository,
    private OrdersRepository: OrdersRepository,
    private cartDetailsRepository: CartDetailsRepository,
    private ProductsRepository: ProductsRepository,
    private OrderDetailsRepository: OrderDetailsRepository,
  ) {}

  async createOrder(
    token: string,
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus,
    productOrders: string[],
  ): Promise<Order> {
    const { user } = await this.authRepository.findOneByToken(token);
    const totalOrder = await productOrders.reduce(async (total, value) => {
      const { cartDetail, product } =
        await this.cartDetailsRepository.findCartDetail(value);
      const totalPrice = 0;
      const totalQuantity = 0;
      return {
        total: totalPrice + Number(product.price),
        quantity: totalQuantity + Number(cartDetail.quantity),
      };
    }, Promise.resolve({ total: 0, quantity: 0 })); // To use async in reduce

    const newOrder = await this.OrdersRepository.createOrder(
      user,
      paymentMethod,
      paymentStatus,
      totalOrder.total,
    );

    Object.values(productOrders).map(async (value) => {
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
