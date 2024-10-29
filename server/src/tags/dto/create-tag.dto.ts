import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    required: true,
    description: 'Tên của thẻ',
  })
  name: string;
}
