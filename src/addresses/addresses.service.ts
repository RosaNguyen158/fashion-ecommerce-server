import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AddressesRepository } from './addresses.repository';
import { AddAddressDto } from './dto/add-address.dto';
import { Address } from './entity/address.entity';

@Injectable()
export class AddressesService {
  constructor(private addresesRepository: AddressesRepository) {}

  async addAddress(addAddressDto: AddAddressDto, user: User): Promise<Address> {
    return await this.addresesRepository.addAddress(addAddressDto, user);
  }
}
