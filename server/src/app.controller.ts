import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { isPublic } from 'decorator/auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @Get('confirm-register')
  @isPublic()
  confirmRegister(
    @Query('token') token: string,
    @Query('email') email: string,
  ) {
    return this.appService.confirmRegister(token, email);
  }

  @ApiExcludeEndpoint()
  @Get('get-secretkey')
  @isPublic()
  getSecretKey() {
    return this.appService.getSecretKey();
  }
}
