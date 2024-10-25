import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên địa điểm không được để trống' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  slug: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;
  branch_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Slogan không được để trống' })
  slogan: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả slogan không được để trống' })
  slogan_description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả sơ đồ không được để trống' })
  diagram_description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả thiết bị không được để trống' })
  equipment_description: string;

  @ApiProperty({ type: [String] })
  images: string[] | any;

  @ApiProperty({ type: [String] })
  slogan_images: string[] | any;

  @ApiProperty({ type: [String] })
  diagram_images: string[] | any;

  @ApiProperty({ type: [String] })
  equipment_images: string[] | any;
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
