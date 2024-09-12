import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { User as UserEntity } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateAuthUserDto } from './dto/create-auth-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private cloudinaryService: CloudinaryService,
  ) {}
  // ! Register
  async register(createUserDto: CreateAuthUserDto) {
    try {
      const { username, email, password, phone } = createUserDto;

      // ? Check email exist
      const findEmail = await this.prismaService.users.findUnique({
        where: {
          email,
        },
      });
      if (findEmail) {
        throw new HttpException('Email đã tồn tại', HttpStatus.BAD_REQUEST);
      }
      // ? hashed password
      const hashedPassword = this.hashedPassword(password);
      // ? Create user
      const user = await this.prismaService.users.create({
        data: {
          username,
          email,
          password: hashedPassword,
          phone,
        },
      });
      // ? Generate token
      const token = await this.generateToken(user);
      // ? Return token
      throw new HttpException(
        { message: 'Đăng ký thành công', data: token },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ auth.service.ts -> register', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }
  // ! Login
  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      // ? Check email exist
      const user = await this.prismaService.users.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        throw new HttpException(
          'Tài khoản hoặc mật khẩu không chính xác',
          HttpStatus.BAD_REQUEST,
        );
      }
      // ? Compare password
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        throw new HttpException(
          'Tài khoản hoặc mật khẩu không chính xác',
          HttpStatus.BAD_REQUEST,
        );
      }
      // ? Generate token
      const token = await this.generateToken(user);
      const { access_token, refresh_token } = token;
      throw new HttpException(
        {
          message: 'Đăng nhập thành công',
          data: { access_token, refresh_token },
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ auth.service.ts -> login', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Logout
  async logout(user: UserEntity) {
    try {
      const findUser = await this.prismaService.users.findUnique({
        where: {
          id: user.id,
        },
      });
      if (!findUser) {
        throw new HttpException(
          'Người dùng không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.prismaService.users.update({
        where: {
          id: user.id,
        },
        data: {
          refresh_token: null,
        },
      });
      throw new HttpException('Đăng xuất thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ auth.service.ts -> logout', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Change Avatar
  async changeAvatar(reqUser: UserEntity, avatar: string) {
    try {
      const findImageUser = await this.prismaService.users.findFirst({
        where: {
          id: Number(reqUser.id),
        },
      });
      if (findImageUser.avatar) {
        await this.cloudinaryService.deleteImageByUrl(findImageUser.avatar);
      }
      await this.prismaService.users.update({
        where: {
          id: Number(reqUser.id),
        },
        data: {
          avatar,
        },
      });
      throw new HttpException(
        'Thay đổi ảnh đại diện thành công',
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ auth.service.ts -> changeAvatar', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Refresh Token
  async refreshToken(refreshToken: string): Promise<any> {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException('Không tìm thấy refresh token');
      }
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('REFRESH_SECRET_JWT'),
      });
      if (!payload) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }
      const user = await this.prismaService.users.findFirst({
        where: {
          refresh_token: refreshToken,
          id: payload.id,
        },
      });

      if (!user) {
        throw new UnauthorizedException(
          'Refresh token không hợp lệ hoặc đã hết hạn',
        );
      }

      const { id, username, email, role, phone } = user;
      const newPayload = { id, username, email, role, phone };
      const access_token = this.jwtService.sign(newPayload, {
        secret: this.configService.get('ACCESS_SECRET_JWT'),
        expiresIn: this.configService.get('EXP_IN_ACCESS_TOKEN'),
      });

      throw new HttpException(
        {
          message: 'Làm mới token thành công',
          access_token,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token signature');
      }

      // Handle other types of errors...

      throw new InternalServerErrorException(
        'Unexpected error during token refresh',
      );
    }
  }

  // ! Generate Token
  async generateToken(user: UserEntity) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_SECRET_JWT'),
      expiresIn: this.configService.get('EXP_IN_ACCESS_TOKEN'),
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_SECRET_JWT'),
      expiresIn: this.configService.get('EXP_IN_REFRESH_TOKEN'),
    });

    await this.prismaService.users.update({
      where: {
        id: user.id,
      },
      data: {
        refresh_token,
      },
    });

    return {
      access_token,
      refresh_token,
    };
  }
  // ! Hashed Password
  hashedPassword(password: string) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
  }
}
