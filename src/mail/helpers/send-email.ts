import bycrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { User } from 'src/users/entities/user.entity';
import { GenerateKey } from './generate-key';
GenerateKey;

const transporter: any = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: '19521550@gm.uit.edu.vn', // generated ethereal user
    pass: 'hzxfxjlxhiajimqz',
  },
});

export const sendOTPVerificationEmail = async (user: User) => {
  const otp = GenerateKey(4);
  try {
    const mailOptions = {
      from: '19521550@gm.uit.edu.vn',
      to: user.email,
      subject: 'Verify Your Email',
      html: `Enter ${otp}`,
    };
    console.log('OTPMAIL ', otp);
    const saltRounds = 10;
    const hashedOTP = await bycrypt.hash(otp, saltRounds);
    await transporter.sendMail(mailOptions);
    return hashedOTP;
  } catch (error) {
    throw new Error(error);
  }
};
