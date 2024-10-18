import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthUserDto } from './dto/create-auth-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import {
  ApiCookieAuth,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { isPublic } from 'decorator/auth.decorator';
import { UploadAvatarAuthDto } from './dto/upload-avatar-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Register
  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Đăng ký thành công',
      data: { access_token: 'string', refresh_token: 'string' },
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
    },
  })
  @ApiOperation({ summary: 'Người dùng tạo tài khoản' })
  @isPublic()
  create(@Body() createUserDto: CreateAuthUserDto) {
    return this.authService.register(createUserDto);
  }

  // ! Login
  @Post('login')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Đăng nhập thành công',
      data: { access_token: 'string', refresh_token: 'string' },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tài khoản hoặc mật khẩu không chính xác',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Người dùng đăng nhập' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // ! Logout
  @Post('logout')
  @ApiOperation({ summary: 'Người dùng đăng xuất' })
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Đăng xuất thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Người dùng không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  // ! Refresh Token
  @Post('refresh-token')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Làm mới token thành công',
      data: { access_token: 'string' },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    example: {
      message: 'Không thể làm mới token',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Làm mới token (Access Token)' })
  @ApiResponse({ status: 200, description: 'Access token refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  refreshToken(@Body() body: RefreshTokenDto) {
    const { refresh_token } = body;
    return this.authService.refreshToken(refresh_token);
  }

  // ! Send Email Verify
  @Post('send-email-verify')
  @isPublic()
  @ApiOperation({ summary: 'Gửi email xác thực' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Gửi email thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Email không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  sendEmailVerify(@Body() body: { email: string }) {
    return this.authService.sendEmailVerify(body.email);
  }

  // ! Verify Token
  @Post('verify-token')
  @isPublic()
  @ApiOperation({ summary: 'Xác thực người dùng bằng token' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xác thực thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Token không hợp lệ hoặc email không đúng',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  verifyToken(@Body() body: VerifyTokenDto) {
    return this.authService.verifyToken(body.email, body.token);
  }

  // ! Upload Avatar
  @Post('upload-avatar')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiOperation({ summary: 'Người dùng tải ảnh đại diện' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new HttpException(`Chỉ chấp nhận ảnh jpg, jpeg, png`, 400),
            false,
          );
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            return cb(
              new HttpException('Kích thước ảnh tối đa 5MB', 400),
              false,
            );
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Đổi ảnh đại diện thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Chỉ chấp nhận ảnh jpg, jpeg, png',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  async uploadAvatar(
    @Request() req,
    @Body() body: UploadAvatarAuthDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatar = await this.cloudinaryService.uploadFileToFolder(
      file,
      'joiepalace/avatar',
    );
    return this.authService.changeAvatar(req.user, avatar);
  }
}
