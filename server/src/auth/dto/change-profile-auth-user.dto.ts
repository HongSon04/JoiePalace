import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeProfileAuthUserDto {
  @ApiProperty({
    required: true,
    description: 'Họ và tên của người dùng',
    example: 'Nguyễn Văn A',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập họ và tên' })
  username: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại liên hệ của người dùng',
    example: '0123456789',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại' })
  phone: string;
}
