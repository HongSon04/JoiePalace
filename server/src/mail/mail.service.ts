import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import dayjs from 'dayjs';
import { ConfirmBookingMailDto } from './dto/ConfirmBookingMail.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserConfirmationBooking(body: ConfirmBookingMailDto) {
    try {
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
    } catch (error) {
      console.log('Lỗi từ MailService->sendUserConfirmationBooking', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  async confirmRegister(name: string, email: string, token: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Xác nhận đăng ký tài khoản tại Joie Palace',
        template: 'confirm-register',
        context: {
          name,
          email,
          date: dayjs().format('DD/MM/YYYY'),
          confirmationLink: `${this.configService.get<string>('FRONTEND_URL')}/confirm-register?token=${token}`,
        },
      });
    } catch (error) {
      console.log('Lỗi từ MailService->confirmRegister', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }
}
