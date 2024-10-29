import { ApiProperty } from '@nestjs/swagger';
import { TagResDto } from 'src/tags/dto/tag.res.dto';

export class ProductResDto {
  @ApiProperty({
    description: 'ID của sản phẩm.',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID của danh mục.',
    example: 1,
  })
  category_id: number;

  @ApiProperty({
    description: 'Tên của sản phẩm',
    example: 'Iphone 12',
  })
  name: string;

  @ApiProperty({
    description: 'Mô tả của sản phẩm',
    example: 'Điện thoại Iphone 12',
  })
  description: string;

  @ApiProperty({
    description: 'Mô tả ngắn của sản phẩm',
    example: 'Iphone 12',
  })
  short_description: string;

  @ApiProperty({
    description: 'Giá của sản phẩm',
    example: 10000000,
  })
  price: number;

  @ApiProperty({
    description: 'Ảnh của sản phẩm',
    example: [
      'https://cloudinary.com/joiepalace/products/iphone12.jpg',
      'https://cloudinary.com/joiepalace/products/iphone12.jpg',
    ],
  })
  image: string[];

  @ApiProperty({
    description: 'Tags của sản phẩm',
    example: [
      {
        TagResDto,
      },
    ],
  })
  tags: TagResDto[];

  @ApiProperty({
    description: 'Ngày tạo của sản phẩm',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Ngày cập nhật của sản phẩm',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}
