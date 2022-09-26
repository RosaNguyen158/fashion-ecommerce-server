import { Injectable, NotFoundException } from '@nestjs/common';

import { OrdersRepository } from 'src/orders/orders.repository';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/users.repository';
import Stripe from 'stripe';
import { CreateCardDto } from './dto/create-cart.dto';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private ordersRepository: OrdersRepository,
    private usersRepository: UserRepository,
  ) {}

  async createNewCustomer(user: User): Promise<Stripe.Customer> {
    try {
      const newCustomer = await this.paymentsRepository.createNewCustomer(user);
      await this.usersRepository.updateStripeIdUser(newCustomer.id, user.id);
      return newCustomer;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async createCard(
    createNewCard: CreateCardDto,
    user: User,
  ): Promise<Stripe.CustomerSource> {
    try {
      return await this.paymentsRepository.createNewCard(createNewCard, user);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async createNewCharge(user: User, orderId: string, cardId: string) {
    try {
      const order = await this.ordersRepository.findOrder(orderId);
      return await this.paymentsRepository.createChagre(user, order, cardId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
