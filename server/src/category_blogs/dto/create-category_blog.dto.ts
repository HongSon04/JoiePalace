import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryBlogDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên danh mục bài viết không được để trống' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả danh mục bài viết không được để trống' })
  description: string;

  @ApiProperty({ required: false })
  short_description: string;

  @ApiProperty({ required: false })
  images: string;
}
