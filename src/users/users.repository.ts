import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async listCategories(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${id}`);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: email });

    return user;
  }

  async findUser(email: string, phone: string): Promise<User> {
    const user = this.userRepository.findOneBy({ email: email });
    return user;
  }

  async createUser(CreateUserDto: CreateUserDto): Promise<User> {
    const { firstname, lastname, email, phone, password, role } = CreateUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      firstName: firstname,
      lastName: lastname,
      email: email,
      phone: phone,
      password: hashedPassword,
      role: role,
    });
    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Email or Number phone already exists');
    }
    return user;
  }

  async updateOtpUser(value: string, id: string): Promise<void> {
    try {
      await this.userRepository.update(id, { otp: value });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateStripeIdUser(value: string, id: string): Promise<void> {
    try {
      await this.userRepository.update(id, { customerStripeId: value });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteUserById(id: string): Promise<void> {
    const result = await this.userRepository.delete({ id: id });

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
