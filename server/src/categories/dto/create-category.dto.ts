import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Tên danh mục, không được để trống',
    example: 'Thực phẩm',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name: string;

  @ApiProperty({
    description: 'ID danh mục cha, nếu có',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'ID danh mục phải là một số nguyên' })
  category_id?: number;

  @ApiProperty({
    description: 'Mô tả chi tiết về danh mục, không được để trống',
    example: 'Danh mục này chứa các sản phẩm thực phẩm tươi sống.',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả danh mục không được để trống' })
  description: string;

  @ApiProperty({
    description: 'Mô tả ngắn gọn về danh mục',
    example: 'Thực phẩm tươi sống',
    required: false,
  })
  @IsOptional()
  short_description?: string;

  @ApiProperty({
    description: 'Ảnh danh mục, không được để trống',
    required: false,
  })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: 'Danh sách các ID thẻ liên quan đến danh mục',
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  tags?: number[];
}
