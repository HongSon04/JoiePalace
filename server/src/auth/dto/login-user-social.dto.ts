import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserSocialDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Nền tảng đăng nhập không được để trống' })
  platform: string;
}
