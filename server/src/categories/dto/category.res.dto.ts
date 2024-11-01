import { ApiProperty } from '@nestjs/swagger';

export class CategoryResDto {
  @ApiProperty({
    description: 'ID của danh mục',
    example: '1',
  })
  id: number;

  @ApiProperty({
    description: 'ID của danh mục cha',
    example: '1',
  })
  category_id: number | null;

  @ApiProperty({
    description: 'Tên danh mục',
    example: 'Danh mục 1',
  })
  name: string;

  @ApiProperty({
    description: 'Slug của danh mục',
    example: 'danh-muc-1',
  })
  slug: string;

  @ApiProperty({
    description: 'Mô tả danh mục',
    example: 'Mô tả danh mục 1',
  })
  description: string;

  @ApiProperty({
    description: 'Mô tả ngắn danh mục',
    example: 'Mô tả ngắn danh mục 1',
  })
  short_description: string;

  @ApiProperty({
    description: 'Ảnh đại diện danh mục',
    example: [
      'https://cloudinary.com/joiepalace/categories/category1.jpg',
      'https://cloudinary.com/joiepalace/categories/category2.jpg',
    ],
  })
  images: string[];

  @ApiProperty({
    description: 'Tạo bởi ID người dùng',
    example: '1',
  })
  created_by: number;

  @ApiProperty({
    description: 'Cập nhật bởi ID người dùng',
    example: '1',
  })
  updated_by: number;

  @ApiProperty({
    description: 'Ngày tạo',
    example: '2021-07-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Ngày cập nhật',
    example: '2021-07-01T00:00:00.000Z',
  })
  updated_at: Date;
}
