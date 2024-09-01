import { User, User as UserEntity } from './entities/user.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { ChangeProfileUserDto } from './dto/change-profile-user.dto';
import { FilterDto } from 'helper/dto/Filter.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create User
  async create(createUserDto: CreateUserDto) {
    const { username, email, password, phone, role, avatar } = createUserDto;

    try {
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
          role,
          avatar,
        },
      });

      // ? Return token
      throw new HttpException('Tạo mới thành công', HttpStatus.CREATED);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi máy chủ, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get Profile
  async getProfile(reqUser: UserEntity) {
    const findUser = await this.prismaService.users.findUnique({
      where: {
        id: Number(reqUser.id),
      },
    });
    const { password, refresh_token, ...user } = findUser;
    throw new HttpException({ data: user }, HttpStatus.OK);
  }

  // ! Change Password
  async changePassword(reqUser: UserEntity, body: ChangePasswordUserDto) {
    const { oldPassword, newPassword, confirmPassword } = body;
    // ? Find user
    const findUser = await this.prismaService.users.findUnique({
      where: {
        id: Number(reqUser.id),
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
        id: Number(reqUser.id),
      },
      data: {
        password: hashedPassword,
      },
    });
    throw new HttpException('Đổi mật khẩu thành công', HttpStatus.OK);
  }

  // ! Change Profile
  async changeProfile(reqUser: UserEntity, body: ChangeProfileUserDto) {
    const { username, phone, role } = body;
    // ? Find user
    const findUser = await this.prismaService.users.findUnique({
      where: {
        id: Number(reqUser.id),
      },
    });
    if (!findUser) {
      throw new HttpException('User không tồn tại', HttpStatus.BAD_REQUEST);
    }
    // ? Update user
    await this.prismaService.users.update({
      where: {
        id: Number(reqUser.id),
      },
      data: {
        username,
        phone,
        role,
      },
    });
    throw new HttpException('Cập nhật thông tin thành công', HttpStatus.OK);
  }

  // ! Get All User
  async getAll(query: FilterDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = Number((page - 1) * itemsPerPage);

    const [res, total] = await this.prismaService.$transaction([
      this.prismaService.users.findMany({
        where: {
          deleted: false,
          OR: [
            {
              username: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              phone: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip,
        take: itemsPerPage,
      }),
      this.prismaService.users.count({
        where: {
          OR: [
            {
              username: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              phone: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
      }),
    ]);

    const lastPage = Math.ceil(total / itemsPerPage);
    const nextPage = page >= lastPage ? null : page + 1;
    const prevPage = page <= 1 ? null : page - 1;
    throw new HttpException(
      {
        data: res,
        pagination: {
          total,
          itemsPerPage,
          lastPage,
          nextPage,
          prevPage,
          currentPage: page,
        },
      },
      HttpStatus.OK,
    );
  }

  // ! Get All User Deleted
  async getAllDeleted(query: FilterDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = Number((page - 1) * itemsPerPage);

    const [res, total] = await this.prismaService.$transaction([
      this.prismaService.users.findMany({
        where: {
          deleted: true,
          OR: [
            {
              username: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              phone: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip,
        take: itemsPerPage,
      }),
      this.prismaService.users.count({
        where: {
          deleted: true,
          OR: [
            {
              username: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              phone: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
      }),
    ]);

    const lastPage = Math.ceil(total / itemsPerPage);
    const nextPage = page >= lastPage ? null : page + 1;
    const prevPage = page <= 1 ? null : page - 1;

    throw new HttpException(
      {
        data: res,
        pagination: {
          total,
          itemsPerPage,
          lastPage,
          nextPage,
          prevPage,
          currentPage: page,
        },
      },
      HttpStatus.OK,
    );
  }

  // ! Get User By Id
  async getById(id: number) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      throw new HttpException('User không tồn tại', HttpStatus.BAD_REQUEST);
    }
    const {
      password,
      refresh_token,
      deleted,
      deleted_at,
      deleted_by,
      ...userData
    } = user;
    throw new HttpException({ data: userData }, HttpStatus.OK);
  }

  // ! Soft Delete User
  async softDelete(reqUser: UserEntity, id: number) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      throw new HttpException('User không tồn tại', HttpStatus.BAD_REQUEST);
    }
    await this.prismaService.users.update({
      where: {
        id: Number(id),
      },
      data: {
        deleted: true,
        deleted_at: new Date(),
        deleted_by: Number(reqUser.id) as any,
      },
    });
    throw new HttpException('Xóa thành công', HttpStatus.OK);
  }

  // ! Restore User
  async restore(id: number) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      throw new HttpException('User không tồn tại', HttpStatus.BAD_REQUEST);
    }
    await this.prismaService.users.update({
      where: {
        id: Number(id),
      },
      data: {
        deleted: false,
        deleted_at: null,
        deleted_by: null,
      },
    });
    throw new HttpException('Khôi phục thành công', HttpStatus.OK);
  }

  // ! Hard Delete User
  async hardDelete(id: number) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      throw new HttpException('User không tồn tại', HttpStatus.BAD_REQUEST);
    }
    // ? Delete Image
    if (user.avatar) {
      await this.cloudinaryService.deleteImageByUrl(user.avatar);
    }
    await this.prismaService.users.delete({
      where: {
        id: Number(id),
      },
    });
    throw new HttpException('Xóa vĩnh viễn thành công', HttpStatus.OK);
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
