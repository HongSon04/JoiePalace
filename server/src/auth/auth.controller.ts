import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthUserDto } from './dto/create-auth-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { ChangePasswordUserDto } from 'src/user/dto/change-password-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChangeProfileAuthUserDto } from './dto/change-profile-auth-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ! Register
  @Post('register')
  create(@Body() createUserDto: CreateAuthUserDto) {
    return this.authService.register(createUserDto);
  }

  // ! Login
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // ! Get Profile
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }

  // ! Change Password
  @UseGuards(AuthGuard)
  @Put('change-password')
  changePassword(
    @Request() req,
    @Body()
    body: ChangePasswordUserDto,
  ) {
    return this.authService.changePassword(req.user, body);
  }

  // ! Change Profile
  @UseGuards(AuthGuard)
  @Patch('change-profile')
  changeProfile(@Request() req, @Body() body: ChangeProfileAuthUserDto) {
    return this.authService.changeProfile(req.user, body);
  }
}
