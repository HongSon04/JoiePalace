import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { ChangeProfileUserDto } from './dto/change-profile-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ! Register
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  // ! Login
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }
  // ! Get Profile
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user);
  }
  // ! Change Password
  @UseGuards(AuthGuard)
  @Put('change-password')
  changePassword(
    @Request() req,
    @Body()
    body: ChangePasswordUserDto,
  ) {
    return this.userService.changePassword(req.user, body);
  }
  // ! Change Profile
  @UseGuards(AuthGuard)
  @Patch('change-profile')
  changeProfile(@Request() req, @Body() body: ChangeProfileUserDto) {
    return this.userService.changeProfile(req.user, body);
  }
}
