import { IsInt } from 'class-validator';

export class CreateCartDetailDto {
  @IsInt()
  quantity: string;
}
