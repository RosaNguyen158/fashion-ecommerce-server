import { Module } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsModule } from 'src/carts/carts.module';

@Module({
  providers: [UserRepository],
  imports: [TypeOrmModule.forFeature([User]), CartsModule],
  exports: [UserRepository],
})
export class UsersModule {}
