import { IsMongoId, IsOptional } from 'class-validator';

export class PaymentSearchDto {
  @IsOptional()
  _id?: string;

  @IsOptional()
  order: string;
}
