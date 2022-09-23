// import { Controller, Get, Inject } from '@nestjs/common';
// import { STRIPE_CLIENT } from '../stripe/constants';
// import Stripe from 'stripe';

import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payment')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('/create-checkout-session')
  async createCheckout() {
    return this.paymentsService.createPayments();
  }

  //   @Post('/create-payment-intent')
  //   async createPaymentIntent() {
  //     return this.paymentsService.paymentIntent();
  //   }
  @Post('/chagre-order')
  async chagreOrder() {
    return this.paymentsService.paymentChagre();
  }
}
