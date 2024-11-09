import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @Get('confirm-register')
  confirmRegister(
    @Query('token') token: string,
    @Query('email') email: string,
  ) {
    return this.appService.confirmRegister(token, email);
  }
}
