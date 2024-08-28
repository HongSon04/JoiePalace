import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class ChangePasswordUserDto {
  @IsNotEmpty({ message: 'Vui lòng nhập Mật Khẩu Cũ' })
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Vui lòng nhập Mật Khẩu Mới' })
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Vui lòng nhập Xác Nhận Mật Khẩu Mới' })
  confirmPassword: string;
}
