import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    CartsModule,
    OrdersModule,
    UsersModule,
    CategoriesModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get('DB_HOST') || 'localhost',
          port: configService.get('DB_PORT') || 5432,
          username: configService.get('DB_USERNAME') || 'postgres',
          password: configService.get('DB_PASSWORD') || '123',
          database: configService.get('DB_DATABASE') || 'fashion-ecommerce',
        };
      },
    }),
    MailModule,
  ],
})
export class AppModule {}
