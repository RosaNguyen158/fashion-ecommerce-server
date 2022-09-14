import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoles } from '../user-roles-enum';

export class AuthCredentialsDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('VN')
  phone: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  /*
  Passwords will contain at least 1 upper case letter
  Passwords will contain at least 1 lower case letter
  Passwords will contain at least 1 number or special character
  There is no length validation (min, max) in this regex!
   */
  password: string;

  role: UserRoles;
}
