import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from 'src/auth/auth.repository';
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
    private UsersRepository: UserRepository,
    private OrdersRepository: OrdersRepository,
    private ProductsRepository: ProductsRepository,
    private OrderDetailsRepository: OrderDetailsRepository,
  ) {}

  async createOrder(
    token: string,
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus,
    productOrders: string,
  ): Promise<Order> {
    const { user } = await this.authRepository.findOneByToken(token);
    let total = 0;
    Object.values(productOrders).map(async (value) => {
      const product = await this.ProductsRepository.findProductByID(value);
      total += product.price;
    });
    const newOrder = await this.OrdersRepository.createOrder(
      user,
      paymentMethod,
      paymentStatus,
      total,
    );

    Object.values(productOrders).map(async (value) => {
      const product = await this.ProductsRepository.findProductByID(value);
      await this.OrderDetailsRepository.createOrderDetail(product, newOrder);
    });

    const order = await this.OrdersRepository.findOrder(newOrder.id);
    return order;
  }
}
