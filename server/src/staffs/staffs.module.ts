import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { PrismaService } from 'src/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [ConfigModule],
  controllers: [StaffsController],
  providers: [StaffsService, PrismaService, CloudinaryService],
})
export class StaffsModule {}
