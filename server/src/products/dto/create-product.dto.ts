import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'ID danh mục của sản phẩm, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  category_id: number;

  @ApiProperty({
    description: 'Tên sản phẩm, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về sản phẩm, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({
    description: 'Mô tả ngắn gọn về sản phẩm, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  short_description: string;

  @ApiProperty({
    description: 'Danh sách các ID thẻ liên quan đến sản phẩm',
    required: false,
  })
  tags?: number[];

  @ApiProperty({
    description: 'Giá của sản phẩm, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @ApiProperty({
    description: 'Ảnh sản phẩm, không được để trống',
    required: true,
  })
  images: string[];
}
