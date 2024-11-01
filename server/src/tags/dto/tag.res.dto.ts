import { ApiProperty } from '@nestjs/swagger';

export class TagResDto {
  @ApiProperty({
    description: 'ID của thẻ.',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Tên của thẻ',
    example: 'Công nghệ',
  })
  name: string;

  @ApiProperty({
    description: 'Slug của thẻ',
    example: 'cong-nghe',
  })
  slug: string;

  @ApiProperty({
    description: 'Ngày tạo của thẻ',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Ngày cập nhật của thẻ',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}
