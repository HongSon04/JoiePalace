import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class CreateAuthUserDto {
  @IsNotEmpty({ message: 'Vui lòng nhập họ và tên' })
  @ApiProperty()
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Vui lòng nhập Email' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại' })
  phone: string;
}
