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
  tags: number[];
}
