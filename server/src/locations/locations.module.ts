import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { PrismaService } from 'src/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { SpacesService } from 'src/spaces/spaces.service';

@Module({
  imports: [ConfigModule],
  controllers: [LocationsController],
  providers: [
    LocationsService,
    PrismaService,
    CloudinaryService,
    SpacesService,
  ],
})
export class LocationsModule {}
