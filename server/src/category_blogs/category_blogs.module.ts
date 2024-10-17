import { Module } from '@nestjs/common';
import { CategoryBlogsService } from './category_blogs.service';
import { CategoryBlogsController } from './category_blogs.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CategoryBlogsController],
  providers: [CategoryBlogsService, CloudinaryService, PrismaService],
})
export class CategoryBlogsModule {}
