import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePartyTypeDto {
  @ApiProperty({
    description: 'Tên loại tiệc, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên loại tiệc không được để trống' })
  name: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về loại tiệc, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({
    description: 'Mô tả ngắn gọn về loại tiệc, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  short_description: string;

  @ApiProperty({
    description: 'Ảnh của loại tiệc, không được để trống',
    required: true,
  })
  images: string[];

  @ApiProperty({
    description: 'Danh sách các ID sản phẩm liên quan đến loại tiệc',
    required: false,
    example: [1, 2, 3],
  })
  @IsNotEmpty({ message: 'Danh sách sản phẩm không được để trống' })
  products: number[];

  @ApiProperty({
    description: 'Giá của loại tiệc, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: string;
}

export class ImagePartyTypesDto {
  @ApiProperty({
    description: 'Ảnh của loại tiệc, không được để trống',
    type: [String],
  })
  images: string[];
}
