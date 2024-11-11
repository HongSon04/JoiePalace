import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FilterDto } from 'helper/dto/Filter.dto';
import { TypeNotifyEnum } from 'helper/enum/type_notify.enum';
import { FormatReturnData } from 'helper/FormatReturnData';
import { PrismaService } from 'src/prisma.service';
import { UpdateStatusNotificationDto } from './dto/update-status-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prismaService: PrismaService) {}

  // ! Send All Notifications For All Users Have Role Admin or Manager
  async sendNotifications(
    title: string,
    contents: string,
    branch_id: number,
    type: TypeNotifyEnum,
  ) {
    try {
      const users = await this.prismaService.users.findMany({
        where: {
          OR: [
            { role: 'admin' },
            { branch_id: Number(branch_id), role: 'manager' },
          ],
        },
      });

      const notifications = users.map((user) => {
        return {
          title,
          content: contents,
          type,
          user_id: user.id,
        };
      });

      // Thực hiện tạo thông báo trong một lần gọi
      await this.prismaService.notifications.createMany({
        data: notifications,
      });

      return;
    } catch (error) {
      console.log('Lỗi từ NotificationsService -> sendNotifications: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get Notifications by user_id
  async getNotifications(user_id: number, query: FilterDto) {
    try {
      const page = query.page ? parseInt(query.page, 10) : 1;
      const itemsPerPage = query.itemsPerPage
        ? parseInt(query.itemsPerPage, 10)
        : 10;
      const skip = (page - 1) * itemsPerPage;

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.notifications.findMany({
          where: {
            user_id: Number(user_id),
          },
          skip: Number(skip),
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
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
          skip: Number(skip),
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Update Is Read Notification by ID
  async updateIsReadNotification(body: UpdateStatusNotificationDto) {
    try {
      const { notification_ids } = body;
      // ? Kiểm tra sản phẩm
      // Handle tags if provided
      console.log('notification_ids: ', notification_ids);
      console.log('type of notification_ids: ', typeof notification_ids);
      if (notification_ids && notification_ids.length > 0) {
        let notify = [];
        console.log('type of notify_id: ', typeof notification_ids);
        console.log('notify_id: ', notification_ids);
        const productsArray = Array.isArray(notification_ids)
          ? notification_ids
          : JSON.parse(String(notification_ids));

        notify = await this.prismaService.notifications.findMany({
          where: {
            id: {
              in: productsArray,
            },
          },
        });

        if (!notify) {
          throw new NotFoundException('Không tìm thấy thông báo!');
        }

        // ? Cập nhật trạng thái đã đọc

        await this.prismaService.notifications.updateMany({
          where: {
            id: {
              in: productsArray,
            },
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
      } else {
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ NotificationsService -> updateIsReadNotification: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }
}
