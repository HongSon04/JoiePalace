import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả danh mục không được để trống' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  short_description: string;
}
