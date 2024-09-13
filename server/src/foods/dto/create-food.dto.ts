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

export class CreateFoodDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  category_id: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Tên món ăn không được để trống' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  short_description: string;

  @ApiProperty({ example: [1, 2, 3] }) // Ví dụ mảng tags
  @IsArray({ message: 'Tags phải là một mảng' })
  @ArrayNotEmpty({ message: 'Tags không được để trống' })
  @ArrayMinSize(1, { message: 'Cần ít nhất 1 tag' })
  @ArrayMaxSize(10, { message: 'Chỉ cho phép tối đa 10 tags' })
  @Type(() => Number) // Chuyển đổi phần tử trong mảng thành kiểu số
  @IsInt({ each: true, message: 'Mỗi tag phải là số nguyên' }) // Kiểm tra từng phần tử trong mảng
  tags: number[];

  @ApiProperty()
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @ApiProperty()
  images: string[];
}
