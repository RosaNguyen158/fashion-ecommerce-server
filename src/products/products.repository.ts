import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesRepository } from 'src/categories/categories.repository';
import { Between, FindOptionsOrderValue, In, Like, Repository } from 'typeorm';
import type { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryName, name, price, description, productImage } =
      createProductDto;

    const checkCategory = await this.categoriesRepository.findCategoryByName(
      categoryName,
    );

    const product = await this.productsRepository.create({
      name: name,
      price: price,
      description: description,
      productImage: productImage,
      category: checkCategory,
    });
    try {
      await this.productsRepository.save(product);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException(`Product's name already exists`);
    }
    return product;
  }
  async listProducts(): Promise<Product[]> {
    const products = await this.productsRepository.find();
    return products;
  }

  async findProductByName(product: string): Promise<Product> {
    const findProduct = await this.productsRepository.findOneBy({
      name: product,
    });

    if (!findProduct) {
      throw new NotFoundException(`There is no product under name ${product}`);
    }
    return findProduct;
  }
  async findProductByID(id: string): Promise<Product> {
    const findProduct = await this.productsRepository.findOneBy({
      id: id,
    });

    if (!findProduct) {
      throw new NotFoundException(`There is no product under id ${id}`);
    }
    return findProduct;
  }

  async findProductByCartID(id: string): Promise<Product> {
    const findProduct = await this.productsRepository.findOne({
      relations: { cartDetails: true },
      where: {
        cartDetails: {
          id: id,
        },
      },
    });
    if (!findProduct) {
      throw new NotFoundException(`Product is not existed in cart`);
    }
    return findProduct;
  }

  async filterProductByName(
    name: string,
    listProduct: Product[],
  ): Promise<Product[]> {
    const listProductInName = await this.productsRepository.find({
      where: {
        name: Like(`%${name}%`),
        id: In([...listProduct.map((product) => product.id)]), // filter
      },
    });

    if (!listProductInName) {
      throw new NotFoundException(
        `There is no category under id ${listProductInName}`,
      );
    }
    return listProductInName;
  }

  async filterProductByCategory(
    categoryName: string,
    listProduct: Product[],
  ): Promise<Product[]> {
    const listProductInCategory = await this.productsRepository.find({
      where: {
        id: In([...listProduct.map((product) => product.id)]),
        category: {
          category: categoryName,
        },
      },
    });

    if (!listProductInCategory) {
      throw new NotFoundException(
        `There is no category under id ${listProductInCategory}`,
      );
    }
    return listProductInCategory;
  }
  async filterProductByPrice(
    price: number,
    order: FindOptionsOrderValue,
    listProduct: Product[],
  ): Promise<Product[]> {
    const listProductInPrice = await this.productsRepository.find({
      where: {
        price: price,
        id: In([...listProduct.map((product) => product.id)]),
      },
      order: {
        price: order,
      },
    });

    if (!listProductInPrice) {
      throw new NotFoundException(
        `There is no category under id ${listProductInPrice}`,
      );
    }

    return listProductInPrice;
  }

  async filterProductByPriceRange(
    value1: number,
    value2: number,
    listProduct: Product[],
  ): Promise<Product[]> {
    const listProductInPrice = await this.productsRepository.find({
      where: {
        price: Between(value1, value2),
        id: In([...listProduct.map((product) => product.id)]),
      },
    });

    if (!listProductInPrice) {
      throw new NotFoundException(
        `There is no category under id ${listProductInPrice}`,
      );
    }

    return listProductInPrice;
  }
}
