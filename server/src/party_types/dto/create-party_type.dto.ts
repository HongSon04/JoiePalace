import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreatePartyTypeDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên loại tiệc không được để trống' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  short_description: string;

  @ApiProperty({ required: true })
  images: string[];

  @ApiProperty({ example: [1, 2, 3] })
  @ArrayNotEmpty({ message: 'Danh sách sản phẩm không được để trống' })
  @ArrayMinSize(1, { message: 'Cần ít nhất 1 món ăn' })
  @ArrayMaxSize(10, { message: 'Chỉ cho phép tối đa 10 món ăn' })
  @Type(() => Number)
  @IsInt({
    each: true,
    message: 'Mỗi phần tử trong Danh sách sản phẩm phải là số nguyên',
  })
  products: number[];

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;
}

export class ImagePartyTypesDto {
  @ApiProperty({ type: [String] })
  @IsArray({ message: 'Hình ảnh phải là một mảng' })
  @ArrayNotEmpty({ message: 'Hình ảnh không được để trống' })
  @IsString({ each: true, message: 'Các mục trong hình ảnh phải là chuỗi' })
  images: string[];
}
