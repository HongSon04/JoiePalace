import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteImageDto {
  @IsNotEmpty({ message: 'Đường dẫn ảnh không được để trống' })
  @ApiProperty({ required: true })
  image_url: string;
}
