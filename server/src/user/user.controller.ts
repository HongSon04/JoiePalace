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
import { ApiQuery, ApiTags } from '@nestjs/swagger';
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
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user);
  }

  // ! Change Password
  @Put('change-password')
  changePassword(
    @Request() req,
    @Body()
    body: ChangePasswordUserDto,
  ) {
    return this.userService.changePassword(req.user, body);
  }

  // ! Change Profile
  @Patch('change-profile')
  changeProfile(@Request() req, @Body() body: ChangeProfileUserDto) {
    return this.userService.changeProfile(req.user, body);
  }

  // ! Get All User

  @Get('get-all')
  @Roles(Role.ADMIN)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  getAll(@Query() query: FilterDto): Promise<any> {
    return this.userService.getAll(query);
  }

  // ! Get All User Deleted
  @Get('get-all-deleted')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  getAllDeleted(@Query() query: FilterDto): Promise<any> {
    return this.userService.getAllDeleted(query);
  }

  // ! Get User By Id
  @Get('get/:user_id')
  getById(@Query('user_id') id: number): Promise<any> {
    return this.userService.getById(id);
  }

  // ! Soft Delete User
  @Delete('soft-delete/:user_id')
  softDelete(@Request() req, @Query('user_id') id: number): Promise<any> {
    return this.userService.softDelete(req.user, id);
  }

  // ! Restore User
  @Post('restore/:user_id')
  restore(@Query('user_id') id: number): Promise<any> {
    return this.userService.restore(id);
  }

  // ! Hard Delete User
  @Delete('hard-delete/:user_id')
  hardDelete(@Query('user_id') id: number): Promise<any> {
    return this.userService.hardDelete(id);
  }
}
