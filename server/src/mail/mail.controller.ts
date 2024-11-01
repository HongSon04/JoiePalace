import {
  Body,
  Controller
} from '@nestjs/common';
import { isPublic } from 'decorator/auth.decorator';
import { ConfirmBookingMailDto } from './dto/ConfirmBookingMail.dto';
import { MailService } from './mail.service';

@Controller('api/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @isPublic()
  async EmailAppointmentSuccessful(@Body() body: ConfirmBookingMailDto) {
    await this.mailService.EmailAppointmentSuccessful(body);
  }

  async confirmRegister(name: string, email: string, token: string) {
    await this.mailService.confirmRegister(name, email, token);
  }
}
