import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { FilterDto } from 'helper/dto/Filter.dto';
import { Role } from 'helper/enum/role.enum';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';
import { FormatReturnData } from 'helper/FormatReturnData';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { ChangeProfileUserDto } from './dto/change-profile-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { User as UserEntity } from './entities/user.entity';

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
        include: {
          memberships: true,
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Get Profile
  async getProfile(reqUser: UserEntity) {
    try {
      const findUser = await this.prismaService.users.findUnique({
        where: {
          id: Number(reqUser.id),
        },
        include: {
          memberships: true,
        },
      });
      if (!findUser) {
        throw new NotFoundException('User không tồn tại');
      }

      const {
        totalAmount,
        totalBookingPending,
        totalBookingSuccess,
        totalBookingCancel,
        totalBookingProcess,
        totalDepositAmount,
      } = await this.getBookingDashboardDataByUserId(Number(reqUser.id));

      let { password, refresh_token, ...user } = findUser as any;

      user.totalAmount = totalAmount;
      user.totalBookingPending = totalBookingPending;
      user.totalBookingSuccess = totalBookingSuccess;
      user.totalBookingCancel = totalBookingCancel;
      user.totalBookingProcess = totalBookingProcess;
      user.totalDepositAmount = totalDepositAmount;

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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Forgot Password
  async forgotPassword(body: ForgotPasswordDto) {
    try {
      const { confirm_password, email, new_password, token } = body;

      // ? Find user
      const findUser = await this.prismaService.users.findUnique({
        where: {
          email,
        },
      });

      if (!findUser) {
        throw new NotFoundException(
          'Email hoặc token không đúng hoặc không tồn tại!',
        );
      }

      // ? Find token
      const findToken = await this.prismaService.verify_tokens.findFirst({
        where: {
          email,
          token,
        },
      });

      if (!findToken) {
        throw new NotFoundException(
          'Email hoặc token không đúng hoặc không tồn tại',
        );
      }

      // ? Check token expired
      if (new Date(findToken.expired_at) < new Date()) {
        // ? Delete token
        await this.prismaService.verify_tokens.deleteMany({
          where: {
            email,
          },
        });
        throw new BadRequestException('Token đã hết hạn');
      }

      // ? Check password
      if (new_password !== confirm_password) {
        throw new BadRequestException('Mật khẩu xác nhận không khớp');
      }

      // ? Hashed password
      const hashedPassword = this.hashedPassword(new_password);

      // ? Update password
      await this.prismaService.users.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
        },
      });

      // ? Delete token
      await this.prismaService.verify_tokens.deleteMany({
        where: {
          email,
        },
      });

      // ! Logout user
      await this.prismaService.users.update({
        where: {
          email,
        },
        data: {
          refresh_token: null,
        },
      });

      throw new HttpException(
        'Thay đổi mật khẩu thành công, vui lòng đăng nhập lại!',
        HttpStatus.OK,
      );
    } catch (error) {}
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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
        include: {
          memberships: true,
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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
          ? { created_at: { gte: startDate, lte: endDate } }
          : {};

      const whereConditions: any = {
        deleted: false,
        ...sortRangeDate,
      };

      if (search) {
        whereConditions.OR = [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [users, total] = await this.prismaService.$transaction([
        this.prismaService.users.findMany({
          where: whereConditions,
          include: {
            memberships: true,
          },
          skip: Number(skip),
          take: itemsPerPage,
          orderBy: {
            memberships: { booking_total_amount: 'desc' },
          },
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

      // Lấy booking statistics cho tất cả users cùng một lúc
      const userStatsPromises = users.map((user) =>
        this.getBookingDashboardDataByUserId(Number(user.id)),
      );
      const userStats = await Promise.all(userStatsPromises);

      // Kết hợp thông tin booking với user data
      const enrichedUsers = users.map((user, index) => ({
        ...user,
        ...userStats[index],
      }));

      throw new HttpException(
        {
          data: FormatReturnData(enrichedUsers, ['password', 'refresh_token']),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> getAll: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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

      const whereConditions: any = {
        deleted: true,
        ...sortRangeDate,
      };

      if (search) {
        whereConditions.OR = [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [users, total] = await this.prismaService.$transaction([
        this.prismaService.users.findMany({
          where: whereConditions,
          include: {
            memberships: true,
          },
          skip: Number(skip),
          take: itemsPerPage,
          orderBy: {
            memberships: { booking_total_amount: 'desc' },
          },
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

      // Lấy booking statistics cho tất cả users cùng một lúc
      const userStatsPromises = users.map((user) =>
        this.getBookingDashboardDataByUserId(Number(user.id)),
      );
      const userStats = await Promise.all(userStatsPromises);

      // Kết hợp thông tin booking với user data
      const enrichedUsers = users.map((user, index) => ({
        ...user,
        ...userStats[index],
      }));

      throw new HttpException(
        {
          data: FormatReturnData(enrichedUsers, ['password', 'refresh_token']),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> getAllDeleted: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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
        ],
        ...sortRangeDate,
      };

      const [users, total] = await this.prismaService.$transaction([
        this.prismaService.users.findMany({
          where: {
            OR: [
              { username: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
            ],
          },
          include: {
            memberships: true,
          },
          skip: Number(skip),
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

      // Lấy booking statistics cho tất cả users cùng một lúc
      const userStatsPromises = users.map((user) =>
        this.getBookingDashboardDataByUserId(Number(user.id)),
      );
      const userStats = await Promise.all(userStatsPromises);

      // Kết hợp thông tin booking với user data
      const enrichedUsers = users.map((user, index) => ({
        ...user,
        ...userStats[index],
      }));

      throw new HttpException(
        {
          data: FormatReturnData(enrichedUsers, ['password', 'refresh_token']),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> getAllByBranchId: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Get User By Id
  async getById(id: number) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          memberships: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User không tồn tại');
      }
      const {
        totalAmount,
        totalBookingPending,
        totalBookingSuccess,
        totalBookingCancel,
        totalBookingProcess,
        totalDepositAmount,
      } = await this.getBookingDashboardDataByUserId(Number(user.id));

      let { password, refresh_token, ...userFormat } = user as any;

      userFormat.totalAmount = totalAmount;
      userFormat.totalBookingPending = totalBookingPending;
      userFormat.totalBookingSuccess = totalBookingSuccess;
      userFormat.totalBookingCancel = totalBookingCancel;
      userFormat.totalBookingProcess = totalBookingProcess;
      userFormat.totalDepositAmount = totalDepositAmount;

      throw new HttpException(
        { data: FormatReturnData(userFormat, ['password', 'refresh_token']) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> getById: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Get User By Email
  async getByEmail(email: string) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: {
          email,
        },
        include: {
          memberships: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User không tồn tại');
      }

      const {
        totalAmount,
        totalBookingPending,
        totalBookingSuccess,
        totalBookingCancel,
        totalBookingProcess,
        totalDepositAmount,
      } = await this.getBookingDashboardDataByUserId(Number(user.id));

      let { password, refresh_token, ...userFormat } = user as any;

      userFormat.totalAmount = totalAmount;
      userFormat.totalBookingPending = totalBookingPending;
      userFormat.totalBookingSuccess = totalBookingSuccess;
      userFormat.totalBookingCancel = totalBookingCancel;
      userFormat.totalBookingProcess = totalBookingProcess;
      userFormat.totalDepositAmount = totalDepositAmount;

      throw new HttpException(
        { data: FormatReturnData(userFormat, ['password', 'refresh_token']) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ user.service.ts -> getById: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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

      if (!user.deleted) {
        throw new BadRequestException(
          'User chưa bị xóa tạm thời, không thể khôi phục!',
        );
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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

      if (!user.deleted) {
        throw new BadRequestException(
          'User chưa bị xóa tạm thời, không thể xóa vĩnh viễn!',
        );
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ? Get Booking Dashboard Data by User ID
  async getBookingDashboardDataByUserId(user_id: number) {
    const bookings = await this.prismaService.bookings.findMany({
      where: {
        user_id: Number(user_id),
      },
      include: {
        booking_details: {
          include: {
            deposits: true,
          },
        },
      },
    });

    // Khởi tạo object để theo dõi các metrics
    const metrics = {
      totalAmount: 0,
      totalBookingPending: 0,
      totalBookingSuccess: 0,
      totalBookingCancel: 0,
      totalBookingProcess: 0,
      totalDepositAmount: 0,
    };

    // Sử dụng reduce thay vì forEach để tính toán metrics
    return bookings.reduce((acc, booking) => {
      if (
        booking.status === 'success' &&
        booking.is_deposit == true &&
        booking.is_confirm == true
      ) {
        acc.totalBookingSuccess++;
        acc.totalDepositAmount += booking.booking_details.reduce(
          (total, detail) => total + detail.deposits.amount,
          0,
        );
        acc.totalAmount += booking.booking_details.reduce(
          (total, detail) => total + detail.total_amount,
          0,
        );
      } else if (booking.status === 'pending') {
        acc.totalBookingPending++;
      } else if (booking.status === 'cancel') {
        acc.totalBookingCancel++;
      } else if (booking.status === 'processing') {
        acc.totalBookingProcess++;
      }
      return acc;
    }, metrics);
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
