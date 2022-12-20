import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterValueDto } from './dto/filter-product';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('product')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post('/create-product')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }

  @Get('/filter-products')
  async filterProducts(
    @Body() filterProducts: FilterValueDto,
  ): Promise<Product[]> {
    const listProducts = await this.productsService.filterProduct(
      filterProducts,
    );
    return listProducts;
  }
}
