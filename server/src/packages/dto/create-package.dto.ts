import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePackageDto {
  @ApiProperty({
    description: 'Tên gói tiệc, không được để trống',
    example: 'Gói tiệc Tiệc Cưới',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên gói tiệc không được để trống' })
  name: string;

  @ApiProperty({
    description: 'ID loại tiệc, không được để trống',
    example: 1,
    required: true,
  })
  @IsNotEmpty({ message: 'Loại tiệc không được để trống' })
  party_type_id: number;

  @ApiProperty({
    description: 'ID menu, không được để trống',
    example: 2,
    required: true,
  })
  @IsNotEmpty({ message: 'Menu không được để trống' })
  menu_id: number;

  @ApiProperty({
    description: 'ID trang trí, không được để trống',
    example: 3,
    required: true,
  })
  @IsNotEmpty({ message: 'Trang trí không được để trống' })
  decor_id: number;

  @ApiProperty({
    description: 'Mô tả chi tiết về gói tiệc, không được để trống',
    example: 'Gói tiệc tiệc cưới bao gồm tất cả các dịch vụ cần thiết.',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({
    description: 'Mô tả ngắn gọn về gói tiệc',
    example: 'Gói tiệc tiệc cưới cao cấp',
    required: false,
  })
  @IsOptional()
  short_description?: string;

  @ApiProperty({
    description: 'Giá của gói tiệc, không được để trống',
    example: 1500000,
    required: true,
  })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @ApiProperty({
    description: 'Ảnh gói tiệc, không được để trống',
    required: true,
  })
  images: string[];

  @ApiProperty({
    example: [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ],
    description:
      'Danh sách các dịch vụ khác (chỉ điền id và số lượng khi đã đặt cọc thành công)',
  })
  extra_service: [{ id: number; quantity: number }] | any;
}
