import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeProfileAuthUserDto {
  @ApiProperty({
    required: true,
    description: 'Họ và tên của người dùng',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập họ và tên' })
  username: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại liên hệ của người dùng',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại' })
  phone: string;
}
