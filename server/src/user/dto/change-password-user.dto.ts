import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class ChangePasswordUserDto {
  @IsNotEmpty({ message: 'Vui lòng nhập Mật Khẩu Cũ' })
  @ApiProperty({ required: true })
  oldPassword: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Vui lòng nhập Mật Khẩu Mới' })
  newPassword: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Vui lòng nhập Xác Nhận Mật Khẩu Mới' })
  confirmPassword: string;
}
