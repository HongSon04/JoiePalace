import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAuthUserDto {
  @ApiProperty({
    required: true,
    description: 'Họ và tên của người dùng',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập họ và tên' })
  username: string;

  @ApiProperty({
    required: true,
    description: 'Địa chỉ email của người dùng',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập Email' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @ApiProperty({
    required: true,
    description: 'Mật khẩu của người dùng',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu' })
  password: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại liên hệ của người dùng',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại' })
  phone: string;
}
