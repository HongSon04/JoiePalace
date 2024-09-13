import { Module } from '@nestjs/common';
import { FunituresService } from './funitures.service';
import { FunituresController } from './funitures.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [FunituresController],
  providers: [FunituresService, CloudinaryService, PrismaService],
})
export class FunituresModule {}
