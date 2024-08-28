import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { ChangeProfileUserDto } from './dto/change-profile-user.dto';
import { FilterDto } from 'helper/dto/Filter.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ! Register
  @UseGuards(AuthGuard)
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

  // ! Get All User
  @UseGuards(AuthGuard)
  @Get('get-all')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  getAll(@Query() query: FilterDto): Promise<any> {
    return this.userService.getAll(query);
  }

  // ! Get User By Id
  @UseGuards(AuthGuard)
  @Get('get/:id')
  getById(@Query('id') id: number): Promise<any> {
    return this.userService.getById(id);
  }

  // ! Soft Delete User
  @UseGuards(AuthGuard)
  @Delete('soft-delete/:id')
  softDelete(@Request() req, @Query('id') id: number): Promise<any> {
    return this.userService.softDelete(req.user, id);
  }

  // ! Restore User
  @UseGuards(AuthGuard)
  @Post('restore/:id')
  restore(@Query('id') id: number): Promise<any> {
    return this.userService.restore(id);
  }

  // ! Hard Delete User
  @UseGuards(AuthGuard)
  @Delete('hard-delete/:id')
  hardDelete(@Query('id') id: number): Promise<any> {
    return this.userService.hardDelete(id);
  }
}
