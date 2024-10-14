import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, PrismaService, CloudinaryService, MailService],
})
export class BookingsModule {}
