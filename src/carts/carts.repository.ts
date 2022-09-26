import { Injectable, NotFoundException } from '@nestjs/common';
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
    console.log('Create cart user', user);
    const newCart = this.cartsRepository.create({
      user: user,
    });
    try {
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
      return cart;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(error.message);
    }
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
