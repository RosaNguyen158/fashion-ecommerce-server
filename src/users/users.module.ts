import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsModule } from 'src/carts/carts.module';

@Module({
  providers: [UsersService, UserRepository],
  imports: [TypeOrmModule.forFeature([User]), CartsModule],
  controllers: [UsersController],
  exports: [UserRepository],
})
export class UsersModule {}
