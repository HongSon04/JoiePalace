import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDecorDto {
  @ApiProperty({
    description: 'Tên trang trí, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên trang trí không được để trống' })
  name: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về trang trí, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({
    description: 'Mô tả ngắn gọn về trang trí, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  short_description: string;

  @ApiProperty({
    description: 'Giá của trang trí, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: string;

  @ApiProperty({
    description: 'Ảnh trang trí, không được để trống',
    required: true,
  })
  images: string[];

  @ApiProperty({
    description: 'Danh sách các ID sản phẩm liên quan đến trang trí',
    required: false,
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Danh sách sản phẩm không được để trống' })
  products: number[];
}

export class ImageDecorDto {
  @ApiProperty({
    description: 'Ảnh trang trí, không được để trống',
    type: [String],
  })
  images: string[];
}
