import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Tên địa điểm không được để trống' })
  name: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;
}
