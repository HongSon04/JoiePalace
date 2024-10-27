import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePackageDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên gói không được để trống' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Loại tiệc không được để trống' })
  party_type_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Menu không được để trống' })
  menu_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Trang trí không được để trống' })
  decor_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({ required: false })
  short_description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @ApiProperty({ required: true })
  images: string[];

  @ApiProperty({
    example: [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ],
    description:
      'Danh sách các dịch vụ khác (chỉ điền id và số lượng khi đã đặt cọc thành công)',
  })
  extra_sevice: [{ id: number; quantity: number }] | any;
}
