import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, CloudinaryService, PrismaService],
})
export class BlogsModule {}
