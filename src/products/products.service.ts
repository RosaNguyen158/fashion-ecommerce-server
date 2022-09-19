import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterValueDto } from './dto/filter-product';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.productsRepository.createProduct(
      createProductDto,
    );
    return product;
  }

  async findProductByName(name: string): Promise<Product> {
    const listProduct = await this.productsRepository.findProductByName(name);
    return listProduct;
  }

  async filterProduct(filterProduct: FilterValueDto): Promise<Product[]> {
    let listProduct = await this.productsRepository.listProducts();

    if (filterProduct.category) {
      listProduct = await this.productsRepository.filterProductByCategory(
        filterProduct.category,
        listProduct,
      );
    }
    if (
      filterProduct.price &&
      !filterProduct.startRange &&
      !filterProduct.endRange
    ) {
      listProduct = await this.productsRepository.filterProductByPrice(
        filterProduct.price,
        filterProduct.order,
        listProduct,
      );
    } else {
      listProduct = await this.productsRepository.filterProductByPriceRange(
        filterProduct.startRange,
        filterProduct.endRange,
        listProduct,
      );
    }
    if (filterProduct.productName) {
      listProduct = await this.productsRepository.filterProductByName(
        filterProduct.productName,
        listProduct,
      );
    }
    return listProduct;
  }
}
