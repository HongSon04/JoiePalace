import { Module } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { SpacesController } from './spaces.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SpacesController],
  providers: [SpacesService, CloudinaryService, PrismaService],
  exports: [SpacesService],
})
export class SpacesModule {}
