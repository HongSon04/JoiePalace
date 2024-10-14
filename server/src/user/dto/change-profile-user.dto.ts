import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from 'helper/role.enum';

export class ChangeProfileUserDto {
  @ApiProperty({ required: true })
  username: string;

  @ApiProperty({ required: true })
  phone: string;

  @ApiProperty({
    required: true,
    enum: Role,
  })
  @IsEnum(Role, { message: 'Vai trò không hợp lệ' })
  role: string;
}
