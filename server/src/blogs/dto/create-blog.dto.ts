import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    required: true,
    description: 'ID của danh mục bài viết',
  })
  @IsNotEmpty({ message: 'Danh mục bài viết không được để trống' })
  category_id: number;

  @ApiProperty({
    required: true,
    description: 'Tiêu đề của bài viết',
  })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @ApiProperty({
    required: true,
    description: 'Mô tả ngắn về bài viết',
  })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({
    required: false,
    description: 'Mô tả ngắn gọn về bài viết (nếu có)',
  })
  @IsOptional()
  short_description?: string;

  @ApiProperty({
    required: true,
    description: 'Nội dung chính của bài viết',
  })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content: string;

  @ApiProperty({
    required: true,
    description: 'Ảnh đại diện của bài viết',
  })
  images: string[];

  @ApiProperty({
    required: false,
    description: 'Danh sách các ID của thẻ liên quan đến bài viết (nếu có)',
    example: [1, 2, 3],
  })
  @IsOptional()
  tags?: number[];
}
