import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { UserRepository } from 'src/users/users.repository';
import { AuthRepository } from './auth.repository';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { CartsRepository } from 'src/carts/carts.repository';
import { Cart } from 'src/carts/entities/cart.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserRepository))
    @Inject(forwardRef(() => CartsRepository))
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
    private cartsRepository: CartsRepository,
    private mailService: MailService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; user: User }> {
    const newUser = await this.userRepository.createUser(createUserDto);
    await this.userRepository.updateOtpUser('otpUser', newUser.id);
    const { accessToken } = await this.authRepository.createSession(newUser);
    const { user } = await this.authRepository.findOneByToken(accessToken);
    await this.cartsRepository.createCart(user);
    // const otpUser = await this.mailService.sendUserConfirmation();
    return { accessToken, user };
  }

  // async verifyOtpEmail(otp: string) {}

  async signIn(
    signInUserDto: SignInUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = signInUserDto;
    const user = await this.userRepository.findUser(email, null);
    if (user && (await bcrypt.compare(password, user.password))) {
      return await this.authRepository.createSession(user);
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async logout(accessToken: string): Promise<void> {
    try {
      const { session } = await this.authRepository.findOneByToken(accessToken);
      const { id } = await this.authRepository.verifyRefreshToken(
        session.refreshToken,
      );
      console.log(id);
      await this.authRepository.removeToken(session.id);
    } catch (e) {
      throw new Error(e);
    }
  }

  async verifyOtpEmail(otp: string, authHeaders: string) {
    const { user, session } = await this.authRepository.findOneByToken(
      authHeaders,
    );
    const validOTP = await bcrypt.compare(`${otp}`, user.otp);
    if (!validOTP) {
      await this.authRepository.deleteSessionById(session.id);
      throw new Error('Verify OTP Failed');
    }
    await this.userRepository.updateOtpUser(null, user.id);
    return this.authRepository.generateTokens(user);
  }

  async updateAccessToken(refreshToken: string, user: User) {
    const id = await this.authRepository.isRefreshTokenValid(refreshToken);
    const accessToken = await this.authRepository.updateSession(id, user);

    return accessToken;
  }

  async parseAuthorizationHeaders(authHeaders: string) {
    const tokenType = authHeaders.split(' ')[0];
    const token = authHeaders.split(' ')[1];

    if (!token || tokenType !== 'Bearer') {
      throw new UnauthorizedException('Incorrect auth headers');
    }

    const payload = this.authRepository.verifyAccessToken(token);

    return payload;
  }
}
