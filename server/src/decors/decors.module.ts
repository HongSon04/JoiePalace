import { Module } from '@nestjs/common';
import { DecorsService } from './decors.service';
import { DecorsController } from './decors.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DecorsController],
  providers: [DecorsService, PrismaService, CloudinaryService],
})
export class DecorsModule {}
