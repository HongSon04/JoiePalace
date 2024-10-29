import { ApiProperty } from '@nestjs/swagger';
import { CategoryResDto } from 'src/categories/dto/category.res.dto';
import { TagResDto } from 'src/tags/dto/tag.res.dto';

export class BlogResDto {
  @ApiProperty({
    description: 'ID bài viết',
    example: '1',
  })
  id: number;

  @ApiProperty({
    description: 'ID của danh mục bài viết',
    example: '2',
  })
  category_id: number;

  @ApiProperty({
    description: 'Danh mục bài viết',
    example: [CategoryResDto],
  })
  category: CategoryResDto;

  @ApiProperty({
    description: 'Tiêu đề bài viết',
    example: 'Bài viết số 1',
  })
  title: string;

  @ApiProperty({
    description: 'Slug của bài viết',
    example: 'bai-viet-so-1',
  })
  slug: string;

  @ApiProperty({
    description: 'Nội dung bài viết',
    example: 'Nội dung bài viết số 1',
  })
  content: string;

  @ApiProperty({
    description: 'Mô tả bài viết',
    example: 'Mô tả bài viết số 1',
  })
  description: string;

  @ApiProperty({
    description: 'Mô tả ngắn bài viết',
    example: 'Mô tả ngắn bài viết số 1',
  })
  short_description: string;

  @ApiProperty({
    description: 'Ảnh đại diện bài viết',
    example: [
      'https://cloudinary.com/joiepalace/blogs/blog1.jpg',
      'https://cloudinary.com/joiepalace/blogs/blog2.jpg',
    ],
  })
  images: string[];

  @ApiProperty({
    description: 'Tags của bài viết',
    example: [TagResDto],
  })
  tags: TagResDto[];

  @ApiProperty({
    description: 'Lượt xem bài viết',
    example: '100',
  })
  views: number;

  @ApiProperty({
    description: 'Ngày tạo bài viết',
    example: '2021-07-20T08:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Ngày cập nhật bài viết',
    example: '2021-07-20T08:00:00.000Z',
  })
  updated_at: Date;
}
