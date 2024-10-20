import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StaffsModule } from './staffs/staffs.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';
import { PrismaService } from './prisma.service';
import { SpacesModule } from './spaces/spaces.module';
import { StagesModule } from './stages/stages.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { MenusModule } from './menus/menus.module';
import { DecorsModule } from './decors/decors.module';
import { PartyTypesModule } from './party_types/party_types.module';
import { FunituresModule } from './funitures/funitures.module';
import { BookingsModule } from './bookings/bookings.module';
import { DepositsModule } from './deposits/deposits.module';
import { ProductsModule } from './products/products.module';
import { PaymentMethodsModule } from './payment_methods/payment_methods.module';
import { BranchesModule } from './branches/branches.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './mail/mail.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_SECRET_JWT'),
        signOptions: {
          expiresIn: configService.get<string>('EXP_IN_ACCESS_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    StaffsModule,
    BranchesModule,
    CloudinaryModule,
    SpacesModule,
    StagesModule,
    CategoriesModule,
    TagsModule,
    ProductsModule,
    MenusModule,
    DecorsModule,
    PartyTypesModule,
    FunituresModule,
    BookingsModule,
    DepositsModule,
    PaymentMethodsModule,
    MailModule,
    DashboardModule,
    FeedbacksModule,
    BlogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
