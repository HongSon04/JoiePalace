import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePartyTypeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Tên loại tiệc không được để trống' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  short_description: string;

  @ApiProperty()
  images: string[];
}

export class ImagePartyTypesDto {
  @ApiProperty({ type: [String] })
  @IsArray({ message: 'Hình ảnh phải là một mảng' })
  @ArrayNotEmpty({ message: 'Hình ảnh không được để trống' })
  @IsString({ each: true, message: 'Các mục trong hình ảnh phải là chuỗi' })
  images: string[];
}
