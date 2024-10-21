import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [FeedbacksController],
  providers: [FeedbacksService, PrismaService],
})
export class FeedbacksModule {}
