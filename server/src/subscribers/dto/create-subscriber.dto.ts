import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSubscriberDto {
  @ApiProperty({
    required: true,
    description: 'Địa chỉ email của người đăng ký',
  })
  @IsNotEmpty({ message: 'Địa chỉ email không được để trống' })
  @IsEmail({}, { message: 'Địa chỉ email không hợp lệ' })
  email: string;
}

