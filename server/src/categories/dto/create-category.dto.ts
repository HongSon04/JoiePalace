import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Tên danh mục, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name: string;

  @ApiProperty({
    description: 'ID danh mục cha, nếu có',
    required: false,
  })
  @IsOptional()
  category_id?: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về danh mục, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả danh mục không được để trống' })
  description: string;

  @ApiProperty({
    description: 'Mô tả ngắn gọn về danh mục',
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
    required: false,
    example: [1, 2, 3],
  })
  @IsOptional()
  tags?: number[];
}
