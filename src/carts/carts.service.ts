import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CartsRepository } from 'src/carts/carts.repository';
import { CartDetail } from './entities/cart-detail.entity';
import { CartDetailsRepository } from './cartdetails.repository';
import { AuthRepository } from 'src/auth/auth.repository';

@Injectable()
export class CartsService {
  constructor(
    @Inject(forwardRef(() => AuthRepository))
    @Inject(forwardRef(() => CartsRepository))
    @Inject(forwardRef(() => CartDetailsRepository))
    private authRepository: AuthRepository,
    private cartsRepository: CartsRepository,
    private cartDetailsRepository: CartDetailsRepository,
  ) {}

  async AddProductToCart(
    authHeaders: string,
    productname: string,
    quantity: number,
  ): Promise<CartDetail> {
    const { user } = await this.authRepository.findOneByToken(authHeaders);
    const cart = await this.cartsRepository.checkExistedCart(user);
    if (!cart) {
      throw new Error('You have not created an account yet');
    }
    const newCart = await this.cartDetailsRepository.addProductToCart(
      cart,
      productname,
      quantity,
    );

    return newCart;
  }
}
