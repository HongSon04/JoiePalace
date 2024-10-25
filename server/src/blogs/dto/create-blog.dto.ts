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

export class CreateBlogDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Danh mục bài viết không được để trống' })
  category_id: number;
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({ required: false })
  short_description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content: string;

  @ApiProperty({ required: true })
  images: string[];

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsArray({ message: 'Tags phải là một mảng' })
  @ArrayNotEmpty({ message: 'Tags không được để trống' })
  @ArrayMinSize(1, { message: 'Cần ít nhất 1 tag' })
  @ArrayMaxSize(10, { message: 'Chỉ cho phép tối đa 10 tags' })
  @Type(() => Number)
  @IsInt({ each: true, message: 'Mỗi tag phải là số nguyên' })
  tags: number[];
}
