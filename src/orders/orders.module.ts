import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UsersModule } from 'src/users/users.module';
import { OrderDetail } from './entities/order-detail.entitty';
import { OrderDetailsRepository } from './orderDetails.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';
import { OrdersRepository } from './orders.repository';
import { CartsModule } from 'src/carts/carts.module';
import { AddressesModule } from 'src/addresses/addresses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]),
    forwardRef(() => AddressesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => CartsModule),
  ],
  providers: [OrdersService, OrdersRepository, OrderDetailsRepository],
  controllers: [OrdersController],
  exports: [OrderDetailsRepository, OrdersRepository],
})
export class OrdersModule {}
