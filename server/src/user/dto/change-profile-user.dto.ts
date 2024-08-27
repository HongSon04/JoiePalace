import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from 'helper/role.enum';

export class ChangeProfileUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  @IsEnum(Role, { message: 'Vai trò không hợp lệ' })
  role: string;
}
