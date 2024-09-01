import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteImageDto {
  @IsString({ message: 'Đường dẫn ảnh không hợp lệ' })
  @IsNotEmpty({ message: 'Đường dẫn ảnh không được để trống' })
  @ApiProperty()
  image_url: string;
}
