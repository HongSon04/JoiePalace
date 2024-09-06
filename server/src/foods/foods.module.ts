import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [FoodsController],
  providers: [
    FoodsService,
    CloudinaryService,
    PrismaService,
  ],
})
export class FoodsModule {}
