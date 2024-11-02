import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import uniqid from 'uniqid';
import { MailService } from 'src/mail/mail.service';
import { Cron } from '@nestjs/schedule';
import { CreateUserSocialDto } from './dto/create-user-social.dto';
import { LoginUserSocialDto } from './dto/login-user-social.dto';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private cloudinaryService: CloudinaryService,
    private mailService: MailService,
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
        include: {
          memberships: true,
        },
      });
      if (findEmail) {
        throw new BadRequestException('Email đã tồn tại');
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
        include: {
          memberships: true,
        },
      });

      // ? Generate token
      const token = await this.generateToken(user);

      // ! Send mail
      const randomToken = uniqid();
      await this.prismaService.verify_tokens.create({
        data: {
          token: randomToken,
          email: user.email,
          expired_at: new Date(Date.now() + 1000 * 60 * 15),
        },
      });
      await this.mailService.confirmRegister(
        user.username,
        user.email,
        randomToken,
      );
      // ? Return token
      throw new HttpException(
        {
          message:
            'Đăng ký thành công bạn vui lòng kiểm tra email để xác nhận tài khoản',
          data: token,
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ auth.service.ts -> register', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Register Social User
  async registerSocialUser(createUserSocialDto: CreateUserSocialDto) {
    try {
      const { email, name, avatar, platform, password, confirm_password } =
        createUserSocialDto;

      // ? Check email exist
      const findEmail = await this.prismaService.users.findUnique({
        where: {
          email,
        },
      });

      if (findEmail) {
        throw new BadRequestException('Email đã tồn tại');
      }

      // ? Check password
      if (password !== confirm_password) {
        throw new BadRequestException('Mật khẩu không khớp');
      }

      // ? hashed password
      const hashedPassword = this.hashedPassword(password);

      // ? Create user
      const user = await this.prismaService.users.create({
        data: {
          username: name,
          email,
          password: hashedPassword,
          avatar,
          platform,
        },
        include: {
          memberships: true,
        },
      });

      // ? Generate token
      const token = await this.generateToken(user);

      // ? Return token
      throw new HttpException(
        {
          message: 'Đăng ký thành công',
          data: token,
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ auth.service.ts -> registerSocialUser', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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
        include: {
          memberships: true,
        },
      });

      if (!user) {
        throw new BadRequestException(
          'Tài khoản hoặc mật khẩu không chính xác',
        );
      }
      // ? Compare password
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        throw new BadRequestException(
          'Tài khoản hoặc mật khẩu không chính xác',
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Login Social
  async loginSocial(loginUserSocial: LoginUserSocialDto) {
    try {
      const { email, platform } = loginUserSocial;

      // ? Check email exist
      const user = await this.prismaService.users.findFirst({
        where: {
          email,
          platform,
        },
        include: {
          memberships: true,
        },
      });

      if (!user) {
        throw new BadRequestException('Tài khoản không tồn tại');
      }

      // ? Generate token
      const token = await this.generateToken(user);

      // ? Return token
      throw new HttpException(
        {
          message: 'Đăng nhập thành công',
          data: token,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ auth.service.ts -> loginSocial', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Logout
  async logout(user: UserEntity) {
    try {
      const findUser = await this.prismaService.users.findUnique({
        where: {
          id: Number(user.id),
        },
      });
      if (!findUser) {
        throw new NotFoundException('Người dùng không tồn tại');
      }
      await this.prismaService.users.update({
        where: {
          id: Number(user.id),
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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
          id: Number(payload.id),
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

  // ! Send Email Verify
  async sendEmailVerify(email: string) {
    try {
      const findUserByEmail = await this.prismaService.users.findFirst({
        where: {
          email,
        },
      });
      if (!findUserByEmail) {
        throw new BadRequestException('Email không tồn tại');
      }

      if (findUserByEmail.verify_at) {
        throw new BadRequestException('Email đã được xác thực');
      }

      const randomToken = uniqid();
      await this.prismaService.verify_tokens.create({
        data: {
          token: randomToken,
          email,
          expired_at: new Date(Date.now() + 1000 * 60 * 15),
        },
      });
      await this.mailService.confirmRegister(
        findUserByEmail.username,
        email,
        randomToken,
      );
    } catch (error) {}
  }

  // ! Verify Token
  async verifyToken(email: string, token: string) {
    try {
      const findToken = await this.prismaService.verify_tokens.findFirst({
        where: {
          token,
          email,
        },
      });

      if (!findToken) {
        throw new BadRequestException(
          'Token không hợp lệ hoặc email không đúng',
        );
      }

      if (findToken.expired_at < new Date()) {
        await this.prismaService.verify_tokens.delete({
          where: {
            id: Number(findToken.id),
          },
        });
        throw new BadRequestException('Token đã hết hạn');
      }

      await this.prismaService.users.update({
        where: {
          email: findToken.email,
        },
        data: {
          verify_at: new Date(),
        },
      });

      await this.prismaService.verify_tokens.delete({
        where: {
          id: Number(findToken.id),
        },
      });

      throw new HttpException('Xác thực thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ auth.service.ts -> verifyEmail', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Generate Token
  async generateToken(user: UserEntity) {
    const payload = {
      id: Number(user.id),
      branch_id: Number(user.branch_id),
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      platform: user.platform,
      memberships: user.memberships,
      active: user.active,
      verify_at: user.verify_at,
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
        id: Number(user.id),
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
