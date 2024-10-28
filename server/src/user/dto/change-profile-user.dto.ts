import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'helper/enum/role.enum';

export class ChangeProfileUserDto {
  @ApiProperty({
    required: true,
    description: 'Tên người dùng',
  })
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  username: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại của người dùng',
  })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @ApiProperty({
    required: true,
    enum: Role,
    description: 'Vai trò của người dùng',
  })
  @IsEnum(Role, { message: 'Vai trò không hợp lệ' })
  role: Role;
}
