import { User as UserEntity } from './entities/user.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { ChangeProfileUserDto } from './dto/change-profile-user.dto';
import { FilterDto } from 'helper/dto/Filter.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';

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
      console.log('Lỗi từ user.service.ts -> create: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get Profile
  async getProfile(reqUser: UserEntity) {
    try {
      const findUser = await this.prismaService.users.findUnique({
        where: {
          id: Number(reqUser.id),
        },
      });
      if (!findUser) {
        throw new HttpException('User không tồn tại', HttpStatus.BAD_REQUEST);
      }
      const { password, refresh_token, ...user } = findUser;
      throw new HttpException({ data: user }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> getProfile: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Change Password
  async changePassword(reqUser: UserEntity, body: ChangePasswordUserDto) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> changePassword: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Change Profile
  async changeProfile(reqUser: UserEntity, body: ChangeProfileUserDto) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> changeProfile: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get All User
  async getAll(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : null;
      const endDate = query.endDate
        ? FormatDateToEndOfDay(query.endDate)
        : null;

      const sortRangeDate: any =
        startDate && endDate
          ? { created_at: { gte: new Date(startDate), lte: new Date(endDate) } }
          : {};

      const whereConditions: any = {
        deleted: false,
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
        ...sortRangeDate,
      };

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.users.findMany({
          where: whereConditions,
          skip,
          take: itemsPerPage,
          orderBy: { created_at: 'desc' },
        }),
        this.prismaService.users.count({ where: whereConditions }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        lastPage,
        nextPage: page < lastPage ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        currentPage: page,
        itemsPerPage,
        total,
      };
      throw new HttpException(
        {
          data: res,
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> getAll: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get All User Deleted
  async getAllDeleted(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : null;
      const endDate = query.endDate
        ? FormatDateToEndOfDay(query.endDate)
        : null;

      const sortRangeDate: any =
        startDate && endDate
          ? { created_at: { gte: new Date(startDate), lte: new Date(endDate) } }
          : {};
      console.log(sortRangeDate);

      const whereConditions: any = {
        deleted: true,
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
        ...sortRangeDate,
      };

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.users.findMany({
          where: whereConditions,
          skip,
          take: itemsPerPage,
          orderBy: { created_at: 'desc' },
        }),
        this.prismaService.users.count({ where: whereConditions }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        lastPage,
        nextPage: page < lastPage ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        currentPage: page,
        itemsPerPage,
        total,
      };
      throw new HttpException(
        {
          data: res,
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> getAllDeleted: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get User By Id
  async getById(id: number) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> getById: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Soft Delete User
  async softDelete(reqUser: UserEntity, id: number) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> softDelete: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Restore User
  async restore(id: number) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> restore: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Hard Delete User
  async hardDelete(id: number) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> hardDelete: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
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

  // ! Test Api
}
