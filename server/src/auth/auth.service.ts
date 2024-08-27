import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { User as UserEntity } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateAuthUserDto } from './dto/create-auth-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { ChangePasswordUserDto } from 'src/user/dto/change-password-user.dto';
import { ChangeProfileAuthUserDto } from './dto/change-profile-auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  // ! Register
  async register(createUserDto: CreateAuthUserDto) {
    const { username, email, password, phone } = createUserDto;

    try {
      // ? Check email exist
      const findEmail = await this.prismaService.users.findUnique({
        where: {
          email,
        },
      });
      if (findEmail) {
        throw new HttpException('Email đã tồn tại', 400);
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
      return {
        message: 'Đăng ký thành công',
        token,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  // ! Login
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    try {
      // ? Check email exist
      const user = await this.prismaService.users.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        throw new HttpException('Email không tồn tại', HttpStatus.BAD_REQUEST);
      }
      // ? Compare password
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        throw new HttpException(
          'Mật khẩu không chính xác',
          HttpStatus.BAD_REQUEST,
        );
      }
      // ? Generate token
      const token = await this.generateToken(user);
      // ? Return token and user
      const { password: userPassword, refresh_token, ...userData } = user;
      return {
        message: 'Đăng nhập thành công',
        token,
      };
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // ! Get Profile
  async getProfile(reqUser: UserEntity) {
    const findUser = await this.prismaService.users.findUnique({
      where: {
        id: reqUser.id,
      },
    });
    const { password, refresh_token, ...user } = findUser;
    return user;
  }
  // ! Change Password
  async changePassword(reqUser: UserEntity, body: ChangePasswordUserDto) {
    const { oldPassword, newPassword, confirmPassword } = body;
    // ? Find user
    const findUser = await this.prismaService.users.findUnique({
      where: {
        id: reqUser.id,
      },
    });
    if (!findUser) {
      throw new HttpException('User không tồn tại', HttpStatus.BAD_REQUEST);
    }
    // ? Check new password !== old password
    if (oldPassword === newPassword) {
      throw new HttpException(
        'Mật khẩu mới không được trùng với mật khẩu cũ',
        HttpStatus.BAD_REQUEST,
      );
    }
    // ? Compare password
    const comparePassword = await bcrypt.compare(
      oldPassword,
      findUser.password,
    );

    if (!comparePassword) {
      throw new HttpException(
        'Mật khẩu cũ không chính xác',
        HttpStatus.BAD_REQUEST,
      );
    }
    // ? Check new password
    if (newPassword !== confirmPassword) {
      throw new HttpException(
        'Mật khẩu xác nhận không khớp',
        HttpStatus.BAD_REQUEST,
      );
    }
    // ? Hashed password
    const hashedPassword = this.hashedPassword(newPassword);
    await this.prismaService.users.update({
      where: {
        id: reqUser.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    return {
      message: 'Đổi mật khẩu thành công',
    };
  }

  // ! Change Profile
  async changeProfile(reqUser: UserEntity, body: ChangeProfileAuthUserDto) {
    const { username, phone } = body;
    // ? Find user
    const findUser = await this.prismaService.users.findUnique({
      where: {
        id: reqUser.id,
      },
    });
    if (!findUser) {
      throw new HttpException('User không tồn tại', HttpStatus.BAD_REQUEST);
    }
    // ? Update user
    await this.prismaService.users.update({
      where: {
        id: reqUser.id,
      },
      data: {
        username,
        phone,
      },
    });
    return {
      message: 'Cập nhật thông tin thành công',
    };
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
      secret: this.configService.get<string>('ACCESS_SECRET_JWT'),
      expiresIn: this.configService.get<string>('EXP_IN_ACCESS_TOKEN'),
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET_JWT'),
      expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
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
