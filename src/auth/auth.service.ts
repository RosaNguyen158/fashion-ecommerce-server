import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { UserRepository } from 'src/users/users.repository';
import { AuthRepository } from './auth.repository';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { Session } from './entities/session.entity';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.createUser(createUserDto);
    const otpUser = await this.mailService.sendUserConfirmation();
    const { accessToken } = await this.authRepository.createSession(user);
    await this.userRepository.updateUser(otpUser, user.id);
    return { accessToken };
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

  async logout(refreshToken: string) {
    try {
      const { id } = await this.authRepository.verifyRefreshToken(refreshToken);

      return this.authRepository.removeToken(id);
    } catch (e) {}
  }

  async verifyOtpEmail(otp: string, authHeaders: string) {
    const token = authHeaders.split(' ')[1];
    const session = await this.authRepository.findOneByToken(token);
    if (!session) throw new Error('Not found user session');
    const user = await this.userRepository.findOne(session.userId);
    const validOTP = await bcrypt.compare(`${otp}`, user.otp);
    if (!validOTP) {
      await this.authRepository.deleteSessionById(session.id);
      await this.userRepository.deleteUserById(user.id);
      throw new Error('Verify OTP Failed');
    }
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
