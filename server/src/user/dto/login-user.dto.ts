import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @ApiProperty({ required: true })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @ApiProperty({ required: true })
  password: string;
}
