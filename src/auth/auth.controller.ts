import { Body, Controller, Post, Req } from '@nestjs/common';
import { Cart } from 'src/carts/entities/cart.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: CreateUserDto,
  ): Promise<{ accessToken: string; user: User }> {
    const { accessToken, user } = await this.authService.signUp(
      authCredentialsDto,
    );
    return { accessToken, user };
  }

  @Post('/verify-otp-email')
  async verifyOtpEmail(
    @Body() otp: string,
    @Req() req: Request,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.verifyOtpEmail(
      req.body['otp'],
      req.headers['authorization'],
    );
    return accessToken;
  }

  @Post('/signin')
  async signIn(
    @Body() signInUserDto: SignInUserDto,
  ): Promise<{ accessToken: string }> {
    const result = await this.authService.signIn(signInUserDto);
    return result;
  }

  @Post('/logout')
  async logout(@Req() req: Request): Promise<void> {
    const token = req.headers['authorization'].split(' ')[1];
    await this.authService.logout(token);
  }
}
