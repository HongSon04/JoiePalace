import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MenusController],
  providers: [MenusService, PrismaService],
})
export class MenusModule {}
