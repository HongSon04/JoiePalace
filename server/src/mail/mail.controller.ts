import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { isPublic } from 'decorator/auth.decorator';
import { ConfirmBookingMailDto } from './dto/ConfirmBookingMail.dto';
import { sendMailToSubcribeUserDto } from './dto/send-mail-to-sub-user.dto';
import { MailService } from './mail.service';

@ApiTags('Mail - Quản lý gửi Mail')
@Controller('api/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiExcludeEndpoint()
  @isPublic()
  async EmailAppointmentSuccessful(@Body() body: ConfirmBookingMailDto) {
    await this.mailService.EmailAppointmentSuccessful(body);
  }
  @ApiExcludeEndpoint()
  @isPublic()
  async confirmRegister(name: string, email: string, token: string) {
    await this.mailService.confirmRegister(name, email, token);
  }

  // ! Send Mail To Subcribe User
  @ApiOperation({ summary: 'Gửi mail cho người đăng ký nhận thông báo' })
  @Post('send-mail-to-sub-user')
  async sendMailToSubcribeUser(@Body() body: sendMailToSubcribeUserDto) {
    await this.mailService.sendMailToSubcribeUser(body);
  }

  // ! Send Mail Forgot Password
  @ApiOperation({ summary: 'Gửi mail quên mật khẩu' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
      },
    },
  })
  @Post('forgot-password')
  async sendMailForgotPassword(@Body() body: { email: string }) {
    await this.mailService.sendMailForgotPassword(body);
  }
}
