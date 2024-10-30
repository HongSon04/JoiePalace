import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { isPublic } from 'decorator/auth.decorator';
import { FilterDto } from 'helper/dto/Filter.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { ChangeProfileUserDto } from './dto/change-profile-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('User - Quản lý người dùng')
@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create User
  @Post('create')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({
    summary: 'Quản trị viên tạo tài khoản',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Tạo tài khoản thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Email đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        if (!file) {
          return cb(
            new BadRequestException('Không có tệp nào được tải lên'),
            false,
          );
        }
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Chỉ chấp nhận ảnh jpg, jpeg, png'),
            false,
          );
        }
        if (file.size > 1024 * 1024 * 5) {
          return cb(
            new BadRequestException('Kích thước ảnh tối đa 5MB'),
            false,
          );
        }
        cb(null, true);
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
        'joiepalace/avatar',
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
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        email: 'string',
        username: 'string',
        platform: 'string',
        avatar: 'string',
        phone: 'string',
        role: 'string',
        active: 'boolean',
        verify_at: 'date',
        created_at: 'string',
        updated_at: 'string',
        membership_id: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'User không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user);
  }

  // ! Get All User
  @Get('get-all')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({
    summary: 'Lấy danh sách tài khoản (trừ tài khoản bị xóa tạm)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          email: 'string',
          username: 'string',
          platform: 'string',
          avatar: 'string',
          role: 'string',
          phone: 'string',
          active: 'boolean',
          verify_at: 'date',
          deleted: 'boolean',
          deleted_at: 'date',
          deleted_by: 'number',
          created_at: 'string',
          updated_at: 'string',
          membership_id: 'number',
        },
      ],
      pagination: {
        total: 'number',
        currentPage: 'number',
        itemsPerPage: 'number',
        lastPage: 'number | null',
        nextPage: 'number | null',
        prevPage: 'number | null',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2004' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  getAll(@Query() query: FilterDto): Promise<any> {
    return this.userService.getAll(query);
  }

  // ! Get All User Deleted
  @Get('get-all-deleted')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          email: 'string',
          username: 'string',
          platform: 'string',
          avatar: 'string',
          role: 'string',
          phone: 'string',
          active: 'boolean',
          verify_at: 'date',
          deleted: 'boolean',
          deleted_at: 'date',
          deleted_by: 'number',
          created_at: 'string',
          updated_at: 'string',
          membership_id: 'number',
        },
      ],
      pagination: {
        total: 'number',
        currentPage: 'number',
        itemsPerPage: 'number',
        lastPage: 'number | null',
        nextPage: 'number | null',
        prevPage: 'number | null',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách tài khoản đã bị xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2004' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  getAllDeleted(@Query() query: FilterDto): Promise<any> {
    return this.userService.getAllDeleted(query);
  }

  // ! Get All User By Branch Id
  @Get('get-all-by-branch-id/:branch_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({
    summary:
      'Lấy danh sách tài khoản theo id chi nhánh (trừ tài khoản bị xóa tạm)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          email: 'string',
          username: 'string',
          platform: 'string',
          avatar: 'string',
          role: 'string',
          phone: 'string',
          active: 'boolean',
          verify_at: 'date',
          deleted: 'boolean',
          deleted_at: 'date',
          deleted_by: 'number',
          created_at: 'string',
          updated_at: 'string',
          membership_id: 'number',
        },
      ],
      pagination: {
        total: 'number',
        currentPage: 'number',
        itemsPerPage: 'number',
        lastPage: 'number | null',
        nextPage: 'number | null',
        prevPage: 'number | null',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Chi nhánh không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2004' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  getAllByBranchId(@Query() query: FilterDto, @Param('branch_id') id: number) {
    return this.userService.getAllByBranchId(query, id);
  }

  // ! Get User By Id
  @Get('get/:user_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        email: 'string',
        username: 'string',
        platform: 'string',
        avatar: 'string',
        role: 'string',
        phone: 'string',
        active: 'boolean',
        verify_at: 'date',
        created_at: 'string',
        updated_at: 'string',
        membership_id: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'User không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin tài khoản theo id' })
  getById(@Param('user_id') id: number): Promise<any> {
    return this.userService.getById(id);
  }

  // ! Get User By Email
  @Get('get-by-email/:email')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        email: 'string',
        username: 'string',
        platform: 'string',
        avatar: 'string',
        role: 'string',
        phone: 'string',
        active: 'boolean',
        verify_at: 'date',
        created_at: 'string',
        updated_at: 'string',
        membership_id: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'User không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin tài khoản theo email' })
  getByEmail(@Param('email') email: string): Promise<any> {
    return this.userService.getByEmail(email);
  }

  // ! Change Password
  @Put('change-password')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Đổi mật khẩu thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Mật khẩu cũ không chính xác',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
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
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Thay đổi thông tin cá nhân thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Email đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Thay đổi thông tin cá nhân' })
  changeProfile(@Request() req, @Body() body: ChangeProfileUserDto) {
    return this.userService.changeProfile(req.user, body);
  }

  // ! Soft Delete User
  @Delete('delete/:user_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa tài khoản thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tài khoản không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Xóa tài khoản tạm thời' })
  softDelete(@Request() req, @Param('user_id') id: number): Promise<any> {
    return this.userService.softDelete(req.user, id);
  }

  // ! Restore User
  @Put('restore/:user_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Khôi phục tài khoản thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tài khoản không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Khôi phục tài khoản đã xóa tạm' })
  restore(@Param('user_id') id: number): Promise<any> {
    return this.userService.restore(id);
  }

  // ! Hard Delete User
  @Delete('destroy/:user_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa tài khoản vĩnh viễn thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tài khoản không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn tài khoản' })
  hardDelete(@Param('user_id') id: number): Promise<any> {
    return this.userService.hardDelete(id);
  }

  // ! Test
  @Get('/xoa-du-an-nay')
  @isPublic()
  xoaDuAnNay() {
    return `https://youtu.be/dQw4w9WgXcQ?si=9TAokZhkWrZZwfay`;
  }
}
