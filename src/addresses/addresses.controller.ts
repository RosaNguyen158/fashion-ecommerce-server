import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AddressesService } from './addresses.service';
import { AddAddressDto } from './dto/add-address.dto';

@Controller('address')
@UseGuards(AuthGuard('jwt'))
export class AddressesController {
  constructor(private addressesService: AddressesService) {}

  @Post('/add-address')
  async addAddress(
    @Body() addAddressDto: AddAddressDto,
    @GetUser() user: User,
  ) {
    const addAddress = await this.addressesService.addAddress(
      addAddressDto,
      user,
    );
    return addAddress;
  }
}
