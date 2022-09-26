import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import Stripe from 'stripe';
import { CreateCardDto } from './dto/create-cart.dto';
import { PaymentsService } from './payments.service';

@Controller('payment')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('/create-new-customer')
  async createNewCustomer(@GetUser() user: User): Promise<Stripe.Customer> {
    const customer = await this.paymentsService.createNewCustomer(user);
    return customer;
  }

  @Post('/create-new-card')
  async createNewCard(
    @GetUser() user: User,
    @Body() createCardDto: CreateCardDto,
  ): Promise<Stripe.CustomerSource> {
    return await this.paymentsService.createCard(createCardDto, user);
  }

  @Post('/create-new-charge')
  async createNewCharge(
    @GetUser() user: User,
    @Body() orderId: string,
    @Body() cardId: string,
  ) {
    return await this.paymentsService.createNewCharge(user, orderId, cardId);
  }
}
