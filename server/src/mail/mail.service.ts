import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import dayjs from 'dayjs';
import { ConfirmBookingMailDto } from './dto/ConfirmBookingMail.dto';
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmationBooking(body: ConfirmBookingMailDto) {
    await this.mailerService.sendMail({
      to: 'test@gmail.com',
      subject: 'Welcome to Our App! Confirm your Email',
      template: 'confirm-booking',
      context: {
        // Dữ liệu cho template
        shift: body.shift,
        organization_date: body.organization_date,
        branchName: body.branchName,
        customerName: body.customerName,
        customerEmail: 'johndoe@gmail.com',
        customerPhone: body.customerPhone,
        branchAddress: body.branchAddress,
        confirmationLink: 'http://localhost:3000/confirm',
      },
    });
  }

  async confirmRegister(name: string, email: string, token: string) {
    console.log('confirmRegister', name, email, token);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác nhận đăng ký tài khoản tại Joie Palace',
      template: 'confirm-register',
      context: {
        name,
        email,
        date: dayjs().format('DD/MM/YYYY'),
        confirmationLink: `${process.env.WEB_URL}confirm?token=${token}`,
      },
    });
  }
}
