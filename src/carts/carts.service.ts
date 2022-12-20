import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from 'src/auth/auth.repository';
import { CartDetailsRepository } from './cartdetails.repository';
import { CartsRepository } from './carts.repository';

@Injectable()
export class CartsService {
  constructor(
    @Inject(forwardRef(() => AuthRepository))
    private cartsRepository: CartsRepository,
    private authRepository: AuthRepository,
  ) {}

  async CreateCart(authHeaders: string) {
    const { user } = await this.authRepository.findOneByToken(authHeaders);
    const checkExistedCart = await this.cartsRepository.checkExistedCart(user);
    if (!checkExistedCart) {
      const newCart = await this.cartsRepository.createCart(user);
    }
  }
}
