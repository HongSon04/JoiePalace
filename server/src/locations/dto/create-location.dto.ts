import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { StageDto } from 'src/stages/dto/stage.dto';

export class CreateLocationDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Tên địa điểm không được để trống' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  slug: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;
  location_id: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Slogan không được để trống' })
  slogan: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả slogan không được để trống' })
  slogan_description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả sơ đồ không được để trống' })
  diagram_description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả thiết bị không được để trống' })
  equipment_description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Tên không gian không được để trống' })
  spaces_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả không gian không được để trống' })
  spaces_description: string;

  @ApiProperty({ type: [String] })
  images: string[] | any;

  @ApiProperty({ type: [String] })
  slogan_images: string[] | any;

  @ApiProperty({ type: [String] })
  diagram_images: string[] | any;

  @ApiProperty({ type: [String] })
  equipment_images: string[] | any;

  @ApiProperty({ type: [String] })
  space_images: string[] | any;
}

export class ImageUploadLocationDto {
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

  @ApiProperty({ type: [String] })
  @IsNotEmpty({ message: 'Hình ảnh không gian không được để trống' })
  space_images: string[] | any;
}
