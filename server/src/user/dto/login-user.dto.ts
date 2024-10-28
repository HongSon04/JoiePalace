import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    required: true,
    description: 'Địa chỉ email của người dùng',
    example: 'email@example.com',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({
    required: true,
    description: 'Mật khẩu của người dùng',
  })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}
