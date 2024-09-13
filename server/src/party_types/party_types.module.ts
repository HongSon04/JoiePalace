import { Module } from '@nestjs/common';
import { PartyTypesService } from './party_types.service';
import { PartyTypesController } from './party_types.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PartyTypesController],
  providers: [PartyTypesService, CloudinaryService, PrismaService],
})
export class PartyTypesModule {}
