import { ApiProperty } from '@nestjs/swagger';

export class TagDto {
  @ApiProperty({ description: 'ID của thẻ' })
  id: number;

  @ApiProperty({ description: 'Tên của thẻ' })
  name: string;

  @ApiProperty({ description: 'Slug của thẻ' })
  slug: string;
}
