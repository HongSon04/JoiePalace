import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { isPublic } from 'decorator/auth.decorator';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { AuthService } from './auth.service';
import { CreateAuthUserDto } from './dto/create-auth-user.dto';
import { LoginUserSocialDto } from './dto/login-user-social.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UploadAvatarAuthDto } from './dto/upload-avatar-auth.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';

@ApiTags('Auth - Xác thực')
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
      error: 'Lỗi gì đó !',
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
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Người dùng đăng nhập' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // ! Login Social
  @Post('login-social')
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
  @ApiOperation({ summary: 'Người dùng đăng nhập qua mạng xã hội' })
  loginSocial(@Body() loginUserDto: LoginUserSocialDto) {
    return this.authService.loginSocial(loginUserDto);
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
  @ApiBearerAuth('authorization')
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
      error: 'Lỗi gì đó !',
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
      error: 'Lỗi gì đó !',
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
      error: 'Lỗi gì đó !',
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
      error: 'Lỗi gì đó !',
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
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Người dùng tải ảnh đại diện' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        if (!file || req.files.images.length === 0) {
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
        if (file.size > 1024 * 1024 * 10) {
          return cb(
            new BadRequestException('Kích thước ảnh tối đa là 10MB'),
            false,
          );
        }
        cb(null, true);
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
      error: 'Lỗi gì đó !',
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
