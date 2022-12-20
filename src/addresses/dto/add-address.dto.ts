import { IsNotEmpty } from 'class-validator';

export class AddAddressDto {
  @IsNotEmpty()
  province = '';

  @IsNotEmpty()
  district = '';

  @IsNotEmpty()
  addressDetail = '';
}
