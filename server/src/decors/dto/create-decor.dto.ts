import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateDecorDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Tên trang trí không được để trống' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  short_description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;
  
  @ApiProperty()
  images: string[];
}

export class ImageDecorDto {
  @ApiProperty({ type: [String] })
  @IsArray({ message: 'Hình ảnh phải là một mảng' })
  @ArrayNotEmpty({ message: 'Hình ảnh không được để trống' })
  @IsString({ each: true, message: 'Các mục trong hình ảnh phải là chuỗi' })
  images: string[];
}
