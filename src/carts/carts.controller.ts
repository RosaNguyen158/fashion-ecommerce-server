import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CartsService } from './carts.service';
import { CartDetail } from './entities/cart-detail.entity';
@Controller('cart')
@UseGuards(AuthGuard())
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Post('/add-product-to-cart')
  async addToCart(
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<CartDetail> {
    const addToCart = await this.cartsService.AddProductToCart(
      user,
      req.body['productName'],
      req.body['quantity'],
    );
    return addToCart;
  }
}
