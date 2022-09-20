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

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ProductsModule),
  ],
  providers: [OrdersService, OrdersRepository, OrderDetailsRepository],
  controllers: [OrdersController],
})
export class OrdersModule {}
