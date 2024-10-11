import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [BranchesController],
  providers: [BranchesService, PrismaService, CloudinaryService, ConfigService],
})
export class BranchesModule {}
