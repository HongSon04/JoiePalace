import { User as UserEntity } from './entities/user.entity';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { FormatReturnData } from 'helper/FormatReturnData';
import { Role } from 'helper/enum/role.enum';

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
    const { username, email, password, phone, role, avatar, branch_id } =
      createUserDto;

    try {
      // ? Check email exist
      const findEmail = await this.prismaService.users.findUnique({
        where: {
          email,
        },
      });
      if (findEmail) {
        throw new BadRequestException('Email đã tồn tại');
      }

      if (branch_id) {
        const checkBranch = await this.prismaService.branches.findUnique({
          where: {
            id: Number(branch_id),
          },
        });

        if (!checkBranch) {
          throw new NotFoundException('Chi nhánh không tồn tại');
        }
      }
      // ? hashed password
      const hashedPassword = this.hashedPassword(password);
      // ? Create user
      const user = await this.prismaService.users.create({
        data: {
          username,
          email,
          branch_id: branch_id ? Number(branch_id) : null,
          password: hashedPassword,
          phone,
          role: role as Role,
          avatar,
        },
      });

      // ? Return token
      throw new HttpException(
        {
          message: 'Tạo tài khoản thành công',
          data: FormatReturnData(user, ['password', 'refresh_token']),
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> create: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
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
        throw new NotFoundException('User không tồn tại');
      }
      const { password, refresh_token, ...user } = findUser;
      throw new HttpException(
        {
          data: FormatReturnData(user, ['password', 'refresh_token']),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> getProfile: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
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
        throw new NotFoundException('User không tồn tại');
      }
      // ? Check new password !== old password
      if (oldPassword === newPassword) {
        throw new BadRequestException(
          'Mật khẩu mới không được trùng với mật khẩu cũ',
        );
      }
      // ? Compare password
      const comparePassword = await bcrypt.compare(
        oldPassword,
        findUser.password,
      );

      if (!comparePassword) {
        throw new BadRequestException('Mật khẩu cũ không chính xác');
      }
      // ? Check new password
      if (newPassword !== confirmPassword) {
        throw new BadRequestException('Mật khẩu xác nhận không khớp');
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
        error,
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
        throw new NotFoundException('User không tồn tại');
      }
      // ? Update user
      const user = await this.prismaService.users.update({
        where: {
          id: Number(reqUser.id),
        },
        data: {
          username,
          phone,
          role: role as Role,
        },
      });
      throw new HttpException(
        {
          message: 'Thay đổi thông tin cá nhân thành công',
          data: FormatReturnData(user, ['password', 'refresh_token']),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> changeProfile: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
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
        : '';
      const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : '';

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
          { role: { contains: search, mode: 'insensitive' } },
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
          data: FormatReturnData(res, ['password', 'refresh_token']),
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
        error,
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
        : '';
      const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : '';

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
          { role: { contains: search, mode: 'insensitive' } },
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
          data: FormatReturnData(res, ['password', 'refresh_token']),
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
        error,
      );
    }
  }

  // ! Get All User By Branch Id
  async getAllByBranchId(query: FilterDto, branch_id: number) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : '';
      const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : '';

      const sortRangeDate: any =
        startDate && endDate
          ? { created_at: { gte: new Date(startDate), lte: new Date(endDate) } }
          : {};

      const whereConditions: any = {
        deleted: false,
        branch_id: Number(branch_id),
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { role: { contains: search, mode: 'insensitive' } },
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
          data: FormatReturnData(res, ['password', 'refresh_token']),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> getAllByBranchId: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
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
        throw new NotFoundException('User không tồn tại');
      }

      throw new HttpException(
        { data: FormatReturnData(user, ['password', 'refresh_token']) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> getById: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Get User By Email
  async getByEmail(email: string) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new NotFoundException('User không tồn tại');
      }

      throw new HttpException(
        { data: FormatReturnData(user, ['password', 'refresh_token']) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> getById: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
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
        throw new NotFoundException('User không tồn tại');
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
      throw new HttpException('Xóa nguời dùng thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> softDelete: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
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
        throw new NotFoundException('User không tồn tại');
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
        error,
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
        throw new NotFoundException('User không tồn tại');
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
        error,
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
