import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';
import { CartDetail } from './entities/cart-detail.entity';

@Injectable()
export class CartDetailsRepository {
  constructor(
    @InjectRepository(CartDetail)
    private readonly cartdetailsRepository: Repository<CartDetail>,
  ) {}

  async findProductInCart(cart: Cart, product: Product): Promise<CartDetail> {
    try {
      const findProduct = await this.cartdetailsRepository.findOneBy({
        cart: cart,
        product: product,
      });
      return findProduct;
    } catch (error) {
      return;
    }
  }

  async addProductToCart(
    cart: Cart,
    product: Product,
    quantity: number,
  ): Promise<CartDetail> {
    const findProduct = await this.findProductInCart(cart, product);
    let addProduct: CartDetail;
    if (!findProduct) {
      addProduct = await this.cartdetailsRepository.create({
        cart: cart,
        quantity: quantity,
        product: product,
      });
    } else {
      await this.cartdetailsRepository.update(findProduct.id, {
        quantity: quantity + 1,
      });
      addProduct = await this.findProductInCart(cart, product);
    }

    return addProduct;
  }
}
