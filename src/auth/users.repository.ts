import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-crendentials.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUser(email: string, phone: string): Promise<User> {
    const user = this.userRepository.findOneBy({ email: email });
    return user;
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { firstname, lastname, email, phone, password, role } =
      authCredentialsDto;

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
      throw new Error(error);
    }
    return user;
  }
}
