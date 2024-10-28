import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePartyTypeDto {
  @ApiProperty({
    description: 'Tên loại tiệc, không được để trống',
    example: 'Tiệc Cưới',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên loại tiệc không được để trống' })
  name: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về loại tiệc, không được để trống',
    example: 'Tiệc cưới với các dịch vụ hoàn hảo.',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({
    description: 'Mô tả ngắn gọn về loại tiệc, không được để trống',
    example: 'Tiệc cưới sang trọng',
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
    example: [1, 2, 3],
    required: false,
  })
  products: number[];

  @ApiProperty({
    description: 'Giá của loại tiệc, không được để trống',
    example: 2000000,
    required: true,
  })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;
}

export class ImagePartyTypesDto {
  @ApiProperty({
    description: 'Ảnh của loại tiệc, không được để trống',
    type: [String],
  })
  images: string[];
}
