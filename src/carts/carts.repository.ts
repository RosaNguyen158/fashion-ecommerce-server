import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from 'src/users/entities/user.entity';
import { CartDetail } from './entities/cart-detail.entity';

@Injectable()
export class CartsRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
  ) {}

  async createCart(user: User): Promise<Cart> {
    console.log('create cart', user);
    const newCart = await this.cartsRepository.create({
      user: user,
    });
    console.log(newCart);
    await this.cartsRepository.save(newCart);
    const cart = await this.cartsRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: user.id,
        },
      },
    });
    console.log('cart 1', cart);
    return cart;
  }

  async listCart(): Promise<Cart[]> {
    const listCart = await this.cartsRepository.find();
    return listCart;
  }

  async checkExistedCart(user: User): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: user.id,
        },
      },
    });
    return cart;
  }
}
