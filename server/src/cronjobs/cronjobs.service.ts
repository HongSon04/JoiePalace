import { Injectable } from '@nestjs/common';
import { TypeNotifyEnum } from 'helper/enum/type_notify.enum';
import { MailService } from 'src/mail/mail.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CronjobsService {
  constructor(
    private prismaService: PrismaService,
    private notificationService: NotificationsService,
    private mailService: MailService,
  ) {}

  // ? Cronjobn auto delete token run every 15 minutes
  async deleteTokenExpired() {
    try {
      const findTokens = await this.prismaService.verify_tokens.findMany({
        where: {
          expired_at: {
            lte: new Date(),
          },
        },
      });

      if (findTokens.length > 0) {
        await this.prismaService.verify_tokens.deleteMany({
          where: {
            id: {
              in: findTokens.map((token) => Number(token.id)),
            },
          },
        });
      }
    } catch (error) {
      console.log(
        'Lỗi từ cronjobs.service.ts -> autoDeletdeleteTokenExpiredeToken: ',
        error,
      );
    }
  }

  // ? Cron Job check booking expired_at and delete it run every 2 hours
  async handleBookingExpiredCron() {
    try {
      const currentDate = new Date();
      // ! Check booking expired_at
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          deleted: false,
          expired_at: {
            gte: currentDate,
          },
        },
      });

      // Xóa booking nếu hết hạn
      bookings.map(async (booking) => {
        // ? Xóa booking
        await this.prismaService.bookings.update({
          where: { id: Number(booking.id) },
          data: {
            deleted: true,
            deleted_at: new Date(),
            deleted_by: 1,
            status: 'cancel',
          },
        });
      });

      // ! Check deposit expired_at
      const deposits = await this.prismaService.deposits.findMany({
        where: {
          expired_at: {
            gte: currentDate,
          },
        },
      });

      // Xóa deposit nếu hết hạn
      deposits.map(async (deposit) => {
        // ? Xóa deposit
        await this.prismaService.deposits.delete({
          where: { id: Number(deposit.id) },
        });
      });

      // ! Send Notification
      const contents: any = {
        name: 'Hệ thống',
        content: 'Đã xóa những đơn đặt tiệc hết hạn',
        type: TypeNotifyEnum.BOOKING_CANCEL,
      };

      await this.notificationService.sendNotifications(
        contents.name,
        contents.content,
        null,
        contents.type,
      );

      // ! Send Email Booking if is_deposit is false
      deposits.map(async (deposit) => {
        // Send Mail
        const bodyMail = {
          name: deposit.name,
          email: deposit.email,
        };
        await this.mailService.cancelAppointment(bodyMail.name, bodyMail.email);
      });

      console.log('Cron Job check booking expired_at and delete it');
    } catch (error) {
      console.log('Lỗi từ booking.service.ts -> handleCron: ', error);
    }
  }

  // ? Send Email Booking if is_deposit is false run every day at 8:00 AM
  async handleBookingEmailCron() {
    try {
      const currentDate = new Date();
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          deleted: false,
          is_deposit: false,
          organization_date: {
            gte: currentDate,
          },
        },
        include: {
          users: {
            select: {
              id: true,
              username: true,
              email: true,
              memberships_id: true,
              phone: true,
              avatar: true,
              role: true,
            },
          },
          branches: true,
          booking_details: {
            include: {
              decors: true,
              menus: {
                include: {
                  products: {
                    include: {
                      tags: true,
                    },
                  },
                },
              },
              deposits: true,
            },
          },
          stages: true,
        },
      });

      // Prepare notification and email content
      bookings.map(async (booking) => {
        // Send Mail
        const bodyMail = {
          name: booking.name,
          email: booking.email,
          amount: booking.booking_details[0].total_amount,
          created_at: booking.created_at,
        };
        await this.mailService.remindDeposit(
          bodyMail.name,
          bodyMail.email,
          bodyMail.amount,
          bodyMail.created_at,
        );
      });
    } catch (error) {
      console.log(
        'Lỗi từ booking.service.ts -> handleBookingEmailCron: ',
        error,
      );
    }
  }
}
