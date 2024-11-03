import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mã xác nhận không được để trống' })
  token: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  new_password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Nhập lại mật khẩu mới không được để trống' })
  confirm_password: string;
}
