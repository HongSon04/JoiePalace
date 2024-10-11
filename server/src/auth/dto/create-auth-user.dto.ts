import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class CreateAuthUserDto {
  @IsNotEmpty({ message: 'Vui lòng nhập họ và tên' })
  @ApiProperty({ required: true })
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Vui lòng nhập Email' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu' })
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại' })
  phone: string;
}
