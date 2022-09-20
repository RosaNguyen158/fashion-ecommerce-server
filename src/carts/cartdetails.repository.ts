import {
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';
import { CartDetail } from './entities/cart-detail.entity';
import { ProductsRepository } from 'src/products/products.repository';
import { User } from 'src/users/entities/user.entity';
import { response } from 'express';

@Injectable()
export class CartDetailsRepository {
  constructor(
    @InjectRepository(CartDetail)
    @Inject(forwardRef(() => ProductsRepository))
    private readonly cartdetailsRepository: Repository<CartDetail>,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async findProductInCart(
    cart: Cart,
    productName: string,
  ): Promise<{ productInfo: Product; findProduct: CartDetail }> {
    try {
      const productInfo = await this.productsRepository.findProductByName(
        productName,
      );

      const findProduct = await this.cartdetailsRepository.findOne({
        relations: {
          product: true,
          cart: true,
        },
        where: {
          cart: {
            id: cart.id,
          },
          product: {
            id: productInfo.id,
          },
        },
      });

      return { productInfo, findProduct };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async addProductToCart(
    cart: Cart,
    productName: string,
    quantity: number,
  ): Promise<CartDetail> {
    const { productInfo, findProduct } = await this.findProductInCart(
      cart,
      productName,
    );
    const product = findProduct;
    let addProduct: CartDetail;
    if (!findProduct) {
      addProduct = await this.cartdetailsRepository.create({
        cart: cart,
        quantity: quantity,
        product: productInfo,
      });
      await this.cartdetailsRepository.save(addProduct);
    } else {
      await this.cartdetailsRepository.update(product.id, {
        quantity: product.quantity + quantity,
      });
      const { findProduct } = await this.findProductInCart(cart, productName);
      addProduct = findProduct;
    }
    return addProduct;
  }
}
