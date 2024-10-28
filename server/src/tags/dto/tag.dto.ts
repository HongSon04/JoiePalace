import { ApiProperty } from '@nestjs/swagger';

export class TagDto {
  @ApiProperty({ description: 'ID của thẻ', example: 1 })
  id: number;

  @ApiProperty({ description: 'Tên của thẻ', example: 'Thẻ Ví dụ' })
  name: string;

  @ApiProperty({ description: 'Slug của thẻ', example: 'the-vi-du' })
  slug: string;
}
