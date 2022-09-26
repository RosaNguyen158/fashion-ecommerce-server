import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  categoryName: string;

  productImage: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  description: string;

  @Type(() => Number)
  @IsNotEmpty()
  price: number;
}
