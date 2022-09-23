import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AddAddressDto } from './dto/add-address.dto';
import { Address } from './entity/address.entity';

@Injectable()
export class AddressesRepository {
  constructor(
    @InjectRepository(Address)
    private readonly addresesRepository: Repository<Address>,
  ) {}

  async addAddress(addAddressDto: AddAddressDto, user: User): Promise<Address> {
    let newAddress: Address;
    if (addAddressDto) {
      newAddress = this.addresesRepository.create({
        province: addAddressDto.province,
        district: addAddressDto.province,
        addressDetail: addAddressDto.province,
        isDefault: false,
        user: user,
      });
    } else {
      newAddress = this.addresesRepository.create({
        isDefault: false,
        user: user,
      });
    }

    try {
      await this.addresesRepository.save(newAddress);
      return newAddress;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findAddressDefaultByUser(user: User): Promise<Address> {
    try {
      const address = await this.addresesRepository.findOne({
        relations: { user: true },
        where: {
          user: user,
          isDefault: true,
        },
      });
      if (!address) {
        throw new NotFoundException('You dont have address');
      }
      return address;
    } catch (error) {
      throw new NotFoundException('You dont have address');
    }
  }
}
