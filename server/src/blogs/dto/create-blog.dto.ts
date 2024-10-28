import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    required: true,
    description: 'ID của danh mục bài viết',
    example: 1,
  })
  @IsNotEmpty({ message: 'Danh mục bài viết không được để trống' })
  category_id: number;

  @ApiProperty({
    required: true,
    description: 'Tiêu đề của bài viết',
    example: 'Hướng dẫn sử dụng NestJS',
  })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @ApiProperty({
    required: true,
    description: 'Mô tả ngắn về bài viết',
    example:
      'Bài viết này sẽ hướng dẫn bạn cách sử dụng NestJS từ cơ bản đến nâng cao.',
  })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({
    required: false,
    description: 'Mô tả ngắn gọn về bài viết (nếu có)',
    example: 'Hướng dẫn sử dụng NestJS cho người mới bắt đầu.',
  })
  @IsOptional()
  short_description?: string;

  @ApiProperty({
    required: true,
    description: 'Nội dung chính của bài viết',
    example: 'NestJS là một framework Node.js mạnh mẽ...',
  })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content: string;

  @ApiProperty({
    required: true,
    description: 'Ảnh đại diện của bài viết',
    example: ['image1.jpg', 'image2.jpg'],
  })
  images: string[];

  @ApiProperty({
    example: [1, 2, 3],
    required: false,
    description: 'Danh sách các ID của thẻ liên quan đến bài viết (nếu có)',
  })
  @IsOptional()
  tags?: number[];
}
