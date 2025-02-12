import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { BookingsModule } from './bookings/bookings.module';
import { BranchesModule } from './branches/branches.module';
import { CategoriesModule } from './categories/categories.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CronjobsModule } from './cronjobs/cronjobs.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DecorsModule } from './decors/decors.module';
import { DepositsModule } from './deposits/deposits.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/role.guard';
import { MailModule } from './mail/mail.module';
import { MembershipsModule } from './memberships/memberships.module';
import { MenusModule } from './menus/menus.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PackagesModule } from './packages/packages.module';
import { PartyTypesModule } from './party_types/party_types.module';
import { PaymentMethodsModule } from './payment_methods/payment_methods.module';
import { PrismaService } from './prisma.service';
import { ProductsModule } from './products/products.module';
import { StagesModule } from './stages/stages.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { TagsModule } from './tags/tags.module';
import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 3,
    }),
    AuthModule,
    UserModule,
    BranchesModule,
    CloudinaryModule,
    StagesModule,
    CategoriesModule,
    TagsModule,
    ProductsModule,
    MenusModule,
    DecorsModule,
    PartyTypesModule,
    BookingsModule,
    DepositsModule,
    PaymentMethodsModule,
    MailModule,
    DashboardModule,
    FeedbacksModule,
    BlogsModule,
    MembershipsModule,
    NotificationsModule,
    SubscribersModule,
    PackagesModule,
    CronjobsModule,
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
