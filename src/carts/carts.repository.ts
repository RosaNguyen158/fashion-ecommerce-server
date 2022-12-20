import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CartsRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
  ) {}

  async createCart(user: User): Promise<Cart> {
    console.log(user);
    const newCategory = await this.cartsRepository.create({
      // user: user,
      user_info: user,
    });
    await this.cartsRepository.save(newCategory);
    console.log(newCategory);
    // try {
    //   await this.cartsRepository.save(newCategory);
    //   console.log(newCategory);
    // } catch (error) {
    //   if (error.code === '23505') throw new Error(error);
    // }
    return newCategory;
  }

  async checkExistedCart(user: User): Promise<boolean> {
    const userCart = await this.cartsRepository.findOneBy({ user: user });

    if (!userCart) return false;
    return true;
  }
}
