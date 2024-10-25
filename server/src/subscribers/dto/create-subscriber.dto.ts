import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSubscriberDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Địa chỉ email không được để trống' })
  @IsEmail({}, { message: 'Địa chỉ email không hợp lệ' })
  email: string;
}
