import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { Role } from 'helper/enum/role.enum';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    description: 'Họ và tên của người dùng',
    example: 'Nguyễn Văn A',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập họ và tên' })
  username: string;

  @ApiProperty({
    required: true,
    description: 'Địa chỉ email của người dùng',
    example: 'email@example.com',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập Email' })
  email: string;

  @ApiProperty({
    required: false,
    description: 'ID của chi nhánh (nếu có)',
    example: 1,
  })
  @IsOptional()
  branch_id?: number;

  @ApiProperty({
    required: true,
    description: 'Mật khẩu của người dùng',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu' })
  password: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại của người dùng',
    example: '+84123456789',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại' })
  phone: string;

  @ApiProperty({
    required: true,
    enum: Role,
    description: 'Vai trò của người dùng',
    example: Role.MANAGER,
  })
  @IsEnum(Role, { message: 'Vai trò không hợp lệ' })
  role: Role;

  @ApiProperty({
    required: false,
    description: 'Trạng thái hoạt động của người dùng',
    example: true,
  })
  @IsOptional()
  active?: boolean;

  @ApiProperty({
    required: false,
    description: 'Ảnh đại diện của người dùng',
  })
  @IsOptional()
  @IsString({ message: 'Ảnh đại diện không hợp lệ' })
  avatar?: string;
}
