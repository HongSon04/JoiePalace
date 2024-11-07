import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import dayjs from 'dayjs';
import { ConfirmBookingMailDto } from './dto/ConfirmBookingMail.dto';
import { ConfigService } from '@nestjs/config';
import { sendMailToSubcribeUserDto } from './dto/send-mail-to-sub-user.dto';
import { PrismaService } from 'src/prisma.service';
import uniqid from 'uniqid';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private prismaService: PrismaService,
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
        error: error.message,
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
        error: error.message,
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
        error: error.message,
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
        error: error.message,
      });
    }
  }

  // ! Gửi Mail tới người dùng đăng ký nhận thông báo
  async sendMailToSubcribeUser(body: sendMailToSubcribeUserDto) {
    try {
      const { title, content, is_receive, is_receive_blog, is_receive_sales } =
        body;

      const subscribers = await this.prismaService.subscribers.findMany({
        where: {
          is_receive: is_receive,
          is_receive_blog: is_receive_blog,
          is_receive_sales: is_receive_sales,
        },
      });

      if (subscribers.length > 0) {
        subscribers.forEach(async (subscriber) => {
          await this.mailerService.sendMail({
            to: subscriber.email,
            subject: title,
            template: 'send-mail-to-sub-user',
            context: {
              title,
              content,
            },
          });
        });
      }

      throw new HttpException(
        {
          message: 'Đã gửi mail thành công!',
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ MailService->sendMailToSubcribeUser', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Gửi mail quên mật khẩu
  async sendMailForgotPassword(body: { email: string }) {
    try {
      const { email } = body;
      const user = await this.prismaService.users.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw new HttpException(
          {
            message: 'Email không tồn tại!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // ? Check xem user đã có token chưa, nếu chưa thì tạo mới
      const findToken = await this.prismaService.verify_tokens.findFirst({
        where: {
          email: email,
        },
      });
      const token = uniqid().toUpperCase();
      if (!findToken) {
        await this.prismaService.verify_tokens.create({
          data: {
            email: email,
            token,
            expired_at: dayjs().add(15, 'minute').toDate(),
          },
        });
      } else {
        await this.prismaService.verify_tokens.updateMany({
          where: {
            email: email,
          },
          data: {
            token,
            expired_at: dayjs().add(15, 'minute').toDate(),
          },
        });
      }

      await this.mailerService.sendMail({
        to: email,
        subject: 'Quên mật khẩu',
        template: 'forgot-password',
        context: {
          email,
          name: user.username,
          date: dayjs().format('DD/MM/YYYY'),
          resetLink: `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`,
        },
      });

      throw new HttpException(
        {
          message: 'Đã gửi mail thành công!',
          data: `https://mail.google.com/mail/u/0/#all`,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ MailService->sendMailForgotPassword', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }
}
