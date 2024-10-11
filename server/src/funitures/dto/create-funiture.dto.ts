import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export enum FunitureType {
  TABLE = 'table',
  CHAIR = 'chair',
}

export class CreateFunitureDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  short_description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @ApiProperty({ example: 'table | chair' }) // Định nghĩa enum để Swagger nhận diện
  @IsEnum(FunitureType, { message: 'Loại nội thất không hợp lệ table | chair' })
  type: FunitureType; // Sử dụng enum ở đây

  @ApiProperty({ type: [String] })
  images: string[];
}

export class ImageFunitureDto {
  @ApiProperty({ type: [String] })
  @IsArray({ message: 'Hình ảnh phải là một mảng' })
  @ArrayNotEmpty({ message: 'Hình ảnh không được để trống' })
  @IsString({ each: true, message: 'Các mục trong hình ảnh phải là chuỗi' })
  images: string[];
}
