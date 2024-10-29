import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({
    required: true,
    description: 'Tên địa điểm của chi nhánh',
  })
  @IsNotEmpty({ message: 'Tên địa điểm không được để trống' })
  name: string;

  @ApiProperty({
    required: true,
    description: 'Địa chỉ của chi nhánh',
  })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại liên hệ của chi nhánh',
  })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @ApiProperty({
    required: false,
    description: 'Slug của chi nhánh (được tạo tự động)',
  })
  slug?: string;

  @ApiProperty({
    required: true,
    description: 'Địa chỉ email liên hệ của chi nhánh',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({
    required: false,
    description: 'ID của chi nhánh (nếu có)',
  })
  branch_id?: number;

  @ApiProperty({
    required: true,
    description: 'Slogan của chi nhánh',
  })
  @IsNotEmpty({ message: 'Slogan không được để trống' })
  slogan: string;

  @ApiProperty({
    required: true,
    description: 'Mô tả chi tiết về slogan',
  })
  @IsNotEmpty({ message: 'Mô tả slogan không được để trống' })
  slogan_description: string;

  @ApiProperty({
    required: true,
    description: 'Mô tả sơ đồ của chi nhánh',
  })
  @IsNotEmpty({ message: 'Mô tả sơ đồ không được để trống' })
  diagram_description: string;

  @ApiProperty({
    required: true,
    description: 'Mô tả thiết bị của chi nhánh',
  })
  @IsNotEmpty({ message: 'Mô tả thiết bị không được để trống' })
  equipment_description: string;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Ảnh đại diện của chi nhánh',
  })
  images?: string[];

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Ảnh slogan của chi nhánh',
  })
  slogan_images?: string[];

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Ảnh sơ đồ của chi nhánh',
  })
  diagram_images?: string[];

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Ảnh trang thiết bị của chi nhánh',
  })
  equipment_images?: string[];
}
export class ImageUploadBranchDto {
  @ApiProperty({ type: [String] })
  @IsNotEmpty({ message: 'Hình ảnh sảnh không được để trống' })
  images: string[] | any;

  @ApiProperty({ type: [String] })
  @IsNotEmpty({ message: 'Hình ảnh slogan không được để trống' })
  slogan_images: string[] | any;

  @ApiProperty({ type: [String] })
  @IsNotEmpty({ message: 'Hình ảnh sơ đồ không được để trống' })
  diagram_images: string[] | any;

  @ApiProperty({ type: [String] })
  @IsNotEmpty({ message: 'Hình ảnh thiết bị không được để trống' })
  equipment_images: string[] | any;
}
