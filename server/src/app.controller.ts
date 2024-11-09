import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('confirm-register')
  confirmRegister(
    @Query('token') token: string,
    @Query('email') email: string,
  ) {
    return this.appService.confirmRegister(token, email);
  }
}
