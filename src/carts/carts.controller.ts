import { Controller, Post, Req } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartDetail } from './entities/cart-detail.entity';
@Controller('cart')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Post('/add-product-to-cart')
  async addToCart(@Req() req: Request): Promise<CartDetail> {
    const addToCart = await this.cartsService.AddProductToCart(
      req.headers['authorization'].split(' ')[1],
      req.body['productName'],
      req.body['quantity'],
    );
    return addToCart;
  }
}
