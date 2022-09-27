import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthRepository } from './auth.repository';
import { Session } from './entities/session.entity';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from 'src/mail/mail.module';
import { CartsModule } from 'src/carts/carts.module';
import { AddressesModule } from 'src/addresses/addresses.module';
import { Test } from '@nestjs/testing';

@Module({
  imports: [
    MailModule,
    forwardRef(() => UsersModule),
    forwardRef(() => CartsModule),
    forwardRef(() => AddressesModule),
    TypeOrmModule.forFeature([Session, Test]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [AuthService, AuthRepository, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, AuthRepository],
})
export class AuthModule {}
