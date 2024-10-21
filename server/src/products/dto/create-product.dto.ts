import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  category_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  short_description: string;

  @ApiProperty({ example: [1, 2, 3] })
  @IsArray({ message: 'Tags phải là một mảng' })
  @ArrayNotEmpty({ message: 'Tags không được để trống' })
  @ArrayMinSize(1, { message: 'Cần ít nhất 1 tag' })
  @ArrayMaxSize(10, { message: 'Chỉ cho phép tối đa 10 tags' })
  @Type(() => Number)
  @IsInt({ each: true, message: 'Mỗi tag phải là số nguyên' })
  tags: number[];

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @ApiProperty({ required: true })
  images: string[];
}
