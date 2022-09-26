/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Type } from 'class-transformer';
import { FindOptionsOrderValue } from 'typeorm';

export class FilterValueDto {
  productName: string;

  @Type(() => Number)
  price: number;

  order: FindOptionsOrderValue;

  @Type(() => Number)
  startRange?: number = 0;

  @Type(() => Number)
  endRange?: number = 0;

  category: string;
}
