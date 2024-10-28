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
  tags: number[];

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @ApiProperty({ required: true })
  images: string[];
}
