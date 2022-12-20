import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.productsRepository.createCategoty(
      createProductDto,
    );
    return product;
  }
}
