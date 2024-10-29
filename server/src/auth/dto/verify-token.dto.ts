import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyTokenDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Token không được để trống' })
  token: string;
}
