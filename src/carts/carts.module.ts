import { forwardRef, Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartDetail } from './entities/cart-detail.entity';
import { CartsRepository } from './carts.repository';
import { CartDetailsRepository } from './cartdetails.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartDetail]),
    forwardRef(() => AuthModule),
  ],
  providers: [CartsService, CartsRepository, CartDetailsRepository],
  controllers: [CartsController],
  exports: [CartsRepository, CartDetailsRepository],
})
export class CartsModule {}
