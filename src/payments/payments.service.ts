import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { Order } from 'src/orders/entities/order.entity';
import { OrderDetailsRepository } from 'src/orders/orderDetails.repository';
import { OrdersRepository } from 'src/orders/orders.repository';
import { UserRepository } from 'src/users/users.repository';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async createPayments() {
    // const order = await this.ordersRepository.findOrder(orderId);
    // const listOrderDetails =
    //   await this.orderDetailsRepository.findListOrderDetails(order);
    try {
      return this.paymentsRepository.createPayment();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async paymentChagre() {
    return this.paymentsRepository.chagreOrder();
  }
}
