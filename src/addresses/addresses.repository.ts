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
      const id = '7800d062-e2a0-4164-a8ec-07bd7189f033';
      console.log(user);
      const newAddress = await this.addresesRepository.update(id, {
        province: addAddressDto.province,
        district: addAddressDto.district,
        addressDetail: addAddressDto.addressDetail,
        isDefault: false,
      });
      // newAddress = await this.addresesRepository.findOne({
      //   where: {
      //     user: {
      //       id: user.id,
      //     },
      //   },
      // });
      console.log('Add address newAddress', newAddress);
    } else {
      newAddress = this.addresesRepository.create({
        isDefault: false,
        user: user,
      });
      await this.addresesRepository.save(newAddress);
    }

    try {
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
          user: {
            id: user.id,
          },
          isDefault: true,
        },
      });
      // if (!address) {
      //   throw new NotFoundException('You dont have an address');
      // }
      return address;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
