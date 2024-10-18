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

export class CreateCategoryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name: string;

  @ApiProperty({ required: false })
  category_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả danh mục không được để trống' })
  description: string;

  @ApiProperty({ required: false })
  short_description: string;

  @ApiProperty({ required: false })
  images: string[];

  @ApiProperty({ example: [1, 2, 3] })
  @IsArray({ message: 'Tags phải là một mảng' })
  @ArrayNotEmpty({ message: 'Tags không được để trống' })
  @ArrayMinSize(1, { message: 'Cần ít nhất 1 tag' })
  @ArrayMaxSize(10, { message: 'Chỉ cho phép tối đa 10 tags' })
  @Type(() => Number)
  @IsInt({ each: true, message: 'Mỗi tag phải là số nguyên' })
  tags: number[];
}
