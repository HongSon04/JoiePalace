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
  tags: number[];
}
