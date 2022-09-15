import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(
    @Body() authCredentialsDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/verifyOtpEmail')
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
}
