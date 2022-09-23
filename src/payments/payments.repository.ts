import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { StripeModule } from 'src/stripe/stripe.module';
import { User } from 'src/users/entities/user.entity';
import { Stripe } from 'stripe';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-cart.dto';
import { Payment } from './entities/payment.entity';
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
});

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async createNewCustomer(user: User): Promise<Stripe.Customer> {
    try {
      console.log(user);

      const newCustomer = await stripe.customers.create({
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
      });
      return newCustomer;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async createNewCard(
    createNewCard: CreateCardDto,
    user: User,
  ): Promise<Stripe.CustomerSource> {
    try {
      const newCard = await stripe.tokens.create({
        card: {
          name: createNewCard.cardName,
          number: createNewCard.cardNumber,
          exp_month: createNewCard.cardExpMonth,
          exp_year: createNewCard.cardExpYear,
          cvc: createNewCard.cardCVC,
        },
      });
      const card = await stripe.customers.createSource(user.customerStripeId, {
        source: `${newCard.id}`,
      });
      return card;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async createChagre(
    user: User,
    order: Order,
    cardId: string,
  ): Promise<Stripe.Charge> {
    try {
      const charge = await stripe.charges.create({
        receipt_email: user.email,
        amount: order.orderAmount,
        currency: 'usd',
        source: cardId,
        customer: user.customerStripeId,
      });
      return charge;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
