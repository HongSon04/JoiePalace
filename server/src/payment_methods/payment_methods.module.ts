import { Module } from '@nestjs/common';
import { PaymentMethodsService } from './payment_methods.service';
import { PaymentMethodsController } from './payment_methods.controller';
import { PrismaService } from 'src/prisma.service';
@Module({
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService, PrismaService],
})
export class PaymentMethodsModule {}
