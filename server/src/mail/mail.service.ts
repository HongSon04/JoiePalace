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

  // ! Gửi mail xác nhận đặt lịch

  async EmailAppointmentSuccessful(body: ConfirmBookingMailDto) {
    try {
      await this.mailerService.sendMail({
        to: 'test@gmail.com',
        subject: 'Welcome to Our App! Confirm your Email',
        template: 'email-appointment-successful-booking',
        context: {
          // Dữ liệu cho template
          shift: body.shift,
          organization_date: body.organization_date,
          branchName: body.branchName,
          customerName: body.customerName,
          customerEmail: 'johndoe@gmail.com',
          customerPhone: body.customerPhone,
          branchAddress: body.branchAddress,
        },
      });
    } catch (error) {
      console.log('Lỗi từ MailService->EmailAppointmentSuccessful', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Gửi mail xác nhận đăng ký tài khoản
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
        error: error,
      });
    }
  }

  // ! Gừi mail nhắc lịch tiền cọc
  async remindDeposit(
    name: string,
    email: string,
    amount: number,
    created_at: string | any,
  ) {
    try {
      const days_left = dayjs(created_at).diff(dayjs(), 'day');
      const booking_date = dayjs(created_at).format('DD/MM/YYYY');
      const fortmatAmount = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(amount);
      await this.mailerService.sendMail({
        to: email,
        subject: 'Nhắc nhở thanh toán tiền cọc',
        template: 'cron-remind-deposit',
        context: {
          name,
          email,
          date: dayjs().format('DD/MM/YYYY'),
          days_left,
          booking_date,
          amount: fortmatAmount,
        },
      });
    } catch (error) {
      console.log('Lỗi từ MailService->remindDeposit', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Gửi mail thông báo hủy lịch
  async cancelAppointment(name: string, email: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Thông báo hủy lịch đặt',
        template: 'booking-cancelled',
        context: {
          name,
        },
      });
    } catch (error) {
      console.log('Lỗi từ MailService->cancelAppointment', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }
}
