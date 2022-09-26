import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategoty(createCategoty: CreateCategoryDto): Promise<Category> {
    const { category } = createCategoty;
    const newCategory = this.categoryRepository.create({
      category: category,
    });
    try {
      await this.categoryRepository.save(newCategory);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Category already exists');
    }
    return newCategory;
  }
  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id: id });

    if (!category) {
      throw new NotFoundException(`There is no category under id ${id}`);
    }

    return category;
  }

  async findCategoryByName(category: string): Promise<Category> {
    const findCategory = await this.categoryRepository.findOneBy({
      category: category,
    });

    if (!category) {
      throw new NotFoundException(`There is no category under id ${category}`);
    }

    return findCategory;
  }
}
