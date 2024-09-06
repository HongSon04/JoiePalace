import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { ChangeProfileUserDto } from './dto/change-profile-user.dto';
import { FilterDto } from 'helper/dto/Filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Roles } from 'decorator/roles.decorator';
import { Role } from 'helper/role.enum';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create User
  @Post('create')
  @ApiOperation({ summary: 'Quản trị viên tạo tài khoản' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new HttpException(
              `Chỉ chấp nhận ảnh jpg, jpeg, png`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            return cb(
              new HttpException(
                'Kích thước ảnh tối đa 5MB',
                HttpStatus.BAD_REQUEST,
              ),
              false,
            );
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const avatar = await this.cloudinaryService.uploadFileToFolder(
        file,
        'joieplace/avatar',
      );
      createUserDto.avatar = avatar;
    } else {
      createUserDto.avatar = '';
    }
    return this.userService.create(createUserDto);
  }

  // ! Get Profile
  @Get('profile')
  @ApiOperation({ summary: 'Lấy thông tin cá nhân' })
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user);
  }

  // ! Get All User
  @Get('get-all')
  @ApiOperation({
    summary: 'Lấy danh sách tài khoản (trừ tài khoản bị xóa tạm)',
  })
  @Roles(Role.ADMIN)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  getAll(@Query() query: FilterDto): Promise<any> {
    return this.userService.getAll(query);
  }

  // ! Get All User Deleted
  @Get('get-all-deleted')
  @ApiOperation({ summary: 'Lấy danh sách tài khoản đã bị xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  getAllDeleted(@Query() query: FilterDto): Promise<any> {
    return this.userService.getAllDeleted(query);
  }

  // ! Get User By Id
  @Get('get/:user_id')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản theo id' })
  getById(@Query('user_id') id: number): Promise<any> {
    return this.userService.getById(id);
  }

  // ! Change Password
  @Put('change-password')
  @ApiOperation({ summary: 'Thay đổi mật khẩu' })
  changePassword(
    @Request() req,
    @Body()
    body: ChangePasswordUserDto,
  ) {
    return this.userService.changePassword(req.user, body);
  }

  // ! Change Profile
  @Patch('change-profile')
  @ApiOperation({ summary: 'Thay đổi thông tin cá nhân' })
  changeProfile(@Request() req, @Body() body: ChangeProfileUserDto) {
    return this.userService.changeProfile(req.user, body);
  }

  // ! Soft Delete User
  @Delete('delete/:user_id')
  @ApiOperation({ summary: 'Xóa tài khoản tạm thời' })
  softDelete(@Request() req, @Query('user_id') id: number): Promise<any> {
    return this.userService.softDelete(req.user, id);
  }

  // ! Restore User
  @Post('restore/:user_id')
  @ApiOperation({ summary: 'Khôi phục tài khoản đã xóa tạm' })
  restore(@Query('user_id') id: number): Promise<any> {
    return this.userService.restore(id);
  }

  // ! Hard Delete User
  @Delete('destroy/:user_id')
  @ApiOperation({ summary: 'Xóa vĩnh viễn tài khoản' })
  hardDelete(@Query('user_id') id: number): Promise<any> {
    return this.userService.hardDelete(id);
  }
}
