import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { CartsRepository } from 'src/carts/carts.repository';
import { User } from './entities/user.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private cartsRepository: CartsRepository,
    private usersReposity: UserRepository,
  ) {}
}
