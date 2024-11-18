import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePackageDto {
  @ApiProperty({
    description: 'Tên gói tiệc, không được để trống',
    required: false,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'ID sảnh',
    required: false,
  })
  @IsOptional()
  stage_id?: string;

  @ApiProperty({
    description: 'ID loại tiệc, không được để trống',
    required: false,
  })
  @IsOptional()
  party_type_id?: string;

  @ApiProperty({
    description: 'ID menu, không được để trống',
    required: false,
  })
  @IsOptional()
  menu_id?: string;

  @ApiProperty({
    description: 'ID trang trí, không được để trống',
    required: false,
  })
  @IsOptional()
  decor_id?: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về gói tiệc, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả chi tiết về gói tiệc không được để trống' })
  description: string;

  @ApiProperty({
    description: 'Mô tả ngắn gọn về gói tiệc',
    required: false,
  })
  @IsOptional()
  short_description?: string;

  @ApiProperty({
    description: 'Giá của gói tiệc, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Giá của gói tiệc không được để trống' })
  price: string;

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
    description: 'Danh sách các dịch vụ khác (ví dụ nước uống, bánh kem, ...)',
    required: false,
  })
  other_service?: [{ id: string; quantity: number }] | any;

  @ApiProperty({
    description: 'Ghi chú',
    required: false,
  })
  @IsOptional()
  note?: string;

  @ApiProperty({
    required: true,
    description: 'Số lượng khách dự kiến',
  })
  @IsNotEmpty({ message: 'Số lượng khách dự kiến không được để trống' })
  number_of_guests: string;

  @ApiProperty({
    required: false,
    description: 'Ngân sách dự kiến cho tiệc',
  })
  budget?: string;

  @ApiProperty({
    description: 'Hiển thị gói tiệc hay không',
    required: false,
  })
  @IsNotEmpty({ message: 'Trạng thái hiện thị hay không' })
  is_show: Boolean;
}
