import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/users/entities/user.entity';
import { GenerateKey } from './helpers/generate-key';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation() {
    const otp = GenerateKey(6);
    await this.mailerService.sendMail({
      to: 'hong123@gmail.com',
      subject: 'Welcome to Nice App! Confirm your Email',
      html: `Enter OTP CODE: ${otp}`,
    });
    console.log(otp);
    const salt = await bcrypt.genSalt();
    const hashedOTP = await bcrypt.hash(otp, salt);
    return hashedOTP;
  }
}
