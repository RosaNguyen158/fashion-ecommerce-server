import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesRepository } from 'src/categories/categories.repository';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async createCategoty(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryName, name, price, description, productImage } =
      createProductDto;

    const checkCategory = await this.categoriesRepository.findCategoryByName(
      categoryName,
    );

    const product = this.productsRepository.create({
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
      throw new NotFoundException(
        `There is no category under id ${findProduct}`,
      );
    }

    return findProduct;
  }
}
