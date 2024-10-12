import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Response,
  Query,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { isPublic } from 'decorator/auth.decorator';
import { ConfirmBookingMailDto } from './dto/ConfirmBookingMail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send')
  @isPublic()
  async sendUserConfirmationBooking(@Body() body: ConfirmBookingMailDto) {
    await this.mailService.sendUserConfirmationBooking(body);
  }

  async confirmRegister(name: string, email: string, token: string) {
    await this.mailService.confirmRegister(name, email, token);
  }
}
