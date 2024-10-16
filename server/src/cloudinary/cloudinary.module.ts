// cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
