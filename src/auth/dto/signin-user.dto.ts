import { IsEmail } from 'class-validator';

export class SignInUserDto {
  @IsEmail()
  email: string;

  password: string;
}
