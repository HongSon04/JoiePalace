import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FilterDto } from 'helper/dto/Filter.dto';
import { FormatReturnData } from 'helper/FormatReturnData';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prismaService: PrismaService) {}

  // ! Get Notifications by user_id
  async getNotifications(user_id: number, query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const skip = (page - 1) * itemsPerPage;

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.notifications.findMany({
          where: {
            user_id: Number(user_id),
          },
          skip,
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.notifications.count({
          where: {
            user_id: Number(user_id),
          },
        }),
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
          data: FormatReturnData(res, []),
          paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.log('Lỗi từ NotificationsService -> getNotifications: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Get Notifications by Email User
  async getNotificationsByEmail(email_user: string, query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const skip = (page - 1) * itemsPerPage;

      const findUser = await this.prismaService.users.findUnique({
        where: {
          email: email_user,
        },
      });

      if (!findUser) {
        throw new NotFoundException('Không tìm thấy người dùng!');
      }

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.notifications.findMany({
          where: {
            user_id: findUser.id,
          },
          skip,
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.notifications.count({
          where: {
            user_id: findUser.id,
          },
        }),
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
          data: FormatReturnData(res, []),
          paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ NotificationsService -> getNotificationsByEmail: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Update Is Read Notification by ID
  async updateIsReadNotification(id: number) {
    try {
      const findNotification =
        await this.prismaService.notifications.findUnique({
          where: {
            id: Number(id),
          },
        });

      if (!findNotification) {
        throw new NotFoundException('Không tìm thấy thông báo!');
      }

      await this.prismaService.notifications.update({
        where: {
          id: Number(id),
        },
        data: {
          is_read: true,
        },
      });

      throw new HttpException(
        {
          message: 'Cập nhật trạng thái thông báo thành công!',
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ NotificationsService -> updateIsReadNotification: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }
}
