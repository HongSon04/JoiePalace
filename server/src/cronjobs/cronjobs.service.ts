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

      // Thực hiện các operations song song để tăng performance
      const [expiredBookings, expiredDeposits] = await Promise.all([
        // Lấy và cập nhật bookings hết hạn
        this.prismaService.$transaction(async (prisma) => {
          const bookings = await prisma.bookings.findMany({
            where: {
              deleted: false,
              status: 'pending',
              expired_at: {
                gte: currentDate,
              },
            },
          });

          if (bookings.length > 0) {
            await prisma.bookings.updateMany({
              where: {
                id: {
                  in: bookings.map((booking) => Number(booking.id)),
                },
              },
              data: {
                deleted: true,
                deleted_at: currentDate,
                deleted_by: 1,
                status: 'cancel',
              },
            });
          }

          return bookings;
        }),

        // Lấy và cập nhật deposits hết hạn
        this.prismaService.$transaction(async (prisma) => {
          const deposits = await prisma.deposits.findMany({
            where: {
              status: 'pending',
              expired_at: {
                gte: currentDate,
              },
            },
          });

          if (deposits.length > 0) {
            await prisma.deposits.updateMany({
              where: {
                id: {
                  in: deposits.map((deposit) => Number(deposit.id)),
                },
              },
              data: {
                status: 'cancel',
              },
            });
          }

          return deposits;
        }),
      ]);

      // Nếu có bất kỳ booking hoặc deposit nào bị hủy
      if (expiredBookings.length > 0 || expiredDeposits.length > 0) {
        // Gửi thông báo hệ thống
        const notificationPromise = this.notificationService.sendNotifications(
          'Hệ thống',
          'Đã xóa những đơn đặt tiệc hết hạn',
          null,
          TypeNotifyEnum.BOOKING_CANCEL,
        );

        // Gửi email cho các deposit
        const emailPromises = expiredDeposits.map((deposit) =>
          this.mailService.cancelAppointment(deposit.name, deposit.email),
        );

        // Chờ tất cả các operations hoàn thành
        await Promise.all([notificationPromise, ...emailPromises]);
      }

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
