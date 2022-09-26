import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressesRepository } from 'src/addresses/addresses.repository';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateAddressOrderDto } from './dto/update-address-order.dto';
import { Order } from './entities/order.entity';
import { PaymentMethod } from './enum/payment-methods-enum';
import { PaymentStatus } from './enum/payment-status-enum';
import { ShippingCost } from './enum/shipping-cost-enum';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private addressesRepository: AddressesRepository,
  ) {}

  async createOrder(
    user: User,
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus,
    total: number,
  ): Promise<Order> {
    let cost: number;
    const addressDefault =
      await this.addressesRepository.findAddressDefaultByUser(user);
    console.log(addressDefault);

    addressDefault.province == 'HN' || addressDefault.province == 'HCM'
      ? (cost = 20)
      : (cost = 30);
    const amount = total + cost;

    const newOrder = this.ordersRepository.create({
      shippingProvince: addressDefault.province,
      shippingDistrict: addressDefault.district,
      shippingPhone: user.phone,
      detailAddress: addressDefault.addressDetail,
      shippingCost: cost,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      orderAmount: amount,
      user: user,
    });
    try {
      await this.ordersRepository.save(newOrder);
      return newOrder;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateOrder(
    updateAddressOrderDto: UpdateAddressOrderDto,
    order: Order,
  ): Promise<void> {
    await this.ordersRepository.update(order.id, {
      shippingProvince: updateAddressOrderDto.shippingProvince,
      shippingDistrict: updateAddressOrderDto.shippingDistrict,
      detailAddress: updateAddressOrderDto.detailAddress,
      shippingPhone: updateAddressOrderDto.shippingPhone,
    });
  }

  async updatePaymentStatus(status: PaymentStatus, order: Order) {
    await this.ordersRepository.update(order.id, {
      paymentStatus: status,
    });
  }

  async findOrder(id: string) {
    const order = await this.ordersRepository.findOneBy({ id });
    return order;
  }
}
