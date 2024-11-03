import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { CronjobsController } from './cronjobs.controller';
import { PrismaService } from 'src/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  controllers: [CronjobsController],
  providers: [
    CronjobsService,
    PrismaService,
    MailService,
    NotificationsService,
  ],
})
export class CronjobsModule {}
