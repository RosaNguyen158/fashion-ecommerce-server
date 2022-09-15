import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [UsersService, UserRepository],
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  exports: [UserRepository],
})
export class UsersModule {}
