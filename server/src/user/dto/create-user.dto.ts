import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'helper/role.enum';

export class CreateUserDto {
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

  @ApiProperty({
    required: true,
    enum: Role,
  })
  @IsEnum(Role, { message: 'Vai trò không hợp lệ' })
  role: string;

  @ApiProperty({ required: true })
  avatar: string;
}
