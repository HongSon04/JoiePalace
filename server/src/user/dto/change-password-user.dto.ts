import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordUserDto {
  @ApiProperty({
    required: true,
    description: 'Mật khẩu cũ của người dùng',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập Mật Khẩu Cũ' })
  oldPassword: string;

  @ApiProperty({
    required: true,
    description: 'Mật khẩu mới của người dùng',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập Mật Khẩu Mới' })
  newPassword: string;

  @ApiProperty({
    required: true,
    description: 'Xác nhận mật khẩu mới của người dùng',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập Xác Nhận Mật Khẩu Mới' })
  confirmPassword: string;
}
