import {
  Body,
  Controller,
  HttpException,
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
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiHeaders,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Request as RequestExpress } from 'express';
import { isPublic } from 'decorator/auth.decorator';
import { UploadAvatarAuthDto } from './dto/upload-avatar-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Register
  @Post('register')
  @isPublic()
  create(@Body() createUserDto: CreateAuthUserDto) {
    return this.authService.register(createUserDto);
  }

  // ! Login
  @Post('login')
  @isPublic()
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // ! Logout
  @Post('logout')
  logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  // ! Refresh Token
  @Post('refresh-token')
  @isPublic()
  @ApiOperation({ summary: 'Refresh access token from cookie' })
  @ApiResponse({ status: 200, description: 'Access token refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  refreshToken(@Req() request: RequestExpress) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.refreshToken(refreshToken);
  }

  // ! Upload Avatar
  @Post('upload-avatar')
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
  async uploadAvatar(
    @Request() req,
    @Body() body: UploadAvatarAuthDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatar = await this.cloudinaryService.uploadFileToFolder(
      file,
      'joieplace/avatar',
    );
    return this.authService.changeAvatar(req.user, avatar);
  }
}
