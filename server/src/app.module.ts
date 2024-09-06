import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocationsModule } from './locations/locations.module';
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
import { FoodsModule } from './foods/foods.module';
@Module({
  imports: [
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
    AuthModule,
    UserModule,
    LocationsModule,
    StaffsModule,
    CloudinaryModule,
    SpacesModule,
    StagesModule,
    CategoriesModule,
    TagsModule,
    FoodsModule,
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
