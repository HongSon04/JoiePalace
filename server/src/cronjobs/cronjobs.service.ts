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

      // Lấy tất cả các deposit hết hạn trong một truy vấn
      const expiredDeposits = await this.prismaService.deposits.findMany({
        where: {
          status: 'pending',
          expired_at: {
            lte: currentDate,
          },
        },
        include: {
          booking_details: {
            include: {
              bookings: true,
            },
          },
        },
      });

      // Nếu có bất kỳ booking hoặc deposit nào bị hủy
      if (expiredDeposits.length > 0) {
        // Cập nhật trạng thái của tất cả các deposit hết hạn
        await this.prismaService.deposits.updateMany({
          where: {
            id: {
              in: expiredDeposits.map((deposit) => Number(deposit.id)),
            },
          },
          data: {
            status: 'cancel',
          },
        });

        // Cập nhật trạng thái của tất cả các booking tương ứng
        await this.prismaService.bookings.updateMany({
          where: {
            id: {
              in: expiredDeposits.flatMap((deposit) =>
                deposit.booking_details.map((booking) =>
                  Number(booking.bookings.id),
                ),
              ),
            },
          },
          data: {
            status: 'cancel',
          },
        });

        // Gửi thông báo và email cho các deposit hết hạn
        const notificationPromises = expiredDeposits.map((deposit) => {
          this.notificationService.sendNotifications(
            deposit.booking_details[0].bookings.name,
            `Đơn đặt tiệc của ${deposit.booking_details[0].bookings.name} đã hết hạn`,
            Number(deposit.booking_details[0].bookings.branch_id),
            TypeNotifyEnum.BOOKING_CANCEL,
          );
          this.notificationService.sendNotifications(
            deposit.name,
            `Đơn đặt cọc của ${deposit.booking_details[0].bookings.name} đã hết hạn`,
            Number(deposit.booking_details[0].bookings.branch_id),
            TypeNotifyEnum.DEPOSIT_CANCEL,
          );
          return this.mailService.cancelAppointment(
            deposit.name,
            deposit.email,
          );
        });

        // Đợi tất cả các operations hoàn thành
        await Promise.allSettled(notificationPromises);
      }

      console.log('Cron Job check booking expired_at and delete it');
    } catch (error) {
      console.log('Lỗi từ booking.service.ts -> handleCron: ', error);
    }
  }

  // ? Send Email Deposit if status is pending run every day at 8:00 AM
  async handleDepositEmailCron() {
    try {
      const currentDate = new Date();
      const deposits = await this.prismaService.deposits.findMany({
        where: {
          status: 'pending',
          expired_at: {
            gte: currentDate,
          },
        },
        include: {
          booking_details: {
            include: {
              bookings: true,
            },
          },
        },
      });

      // Prepare notification and email content
      deposits.map(async (deposit) => {
        // Send Mail
        const bodyMail = {
          name: deposit.name,
          email: deposit.email,
          amount: deposit.amount,
          created_at: deposit.created_at,
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
        'Lỗi từ booking.service.ts -> handleDepositEmailCron: ',
        error,
      );
    }
  }
}
