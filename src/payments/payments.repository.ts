import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StripeModule } from 'src/stripe/stripe.module';
import { Stripe } from 'stripe';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(
  'sk_test_51LkOqlHBiY9n7vwTdeeSjZliB4ITN79r2x1V3WNyJbbXo7EAzfLTZQyM5FNfWhZFnB6y8E1K8JAH5PekFaOf5YNK0084RoXr99',
  { apiVersion: '2022-08-01' },
);

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async createPayment() {
    try {
      const result = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'T-shirt',
              },
              unit_amount: 2000,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });
      return result;
    } catch (error) {
      throw new NotFoundException('bug');
    }
  }

  async chagreOrder() {
    const charge = await stripe.charges.create({
      amount: 2000,
      currency: 'usd',
      source: 'tok_mastercard',
      description:
        'My First Test Charge (created for API docs at https://www.stripe.com/docs/api)',
    });
    return charge;
  }
}
