import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Địa điểm không được để trống' })
  location_id: number;
  @ApiProperty()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Phương thức thanh toán không được để trống' })
  payment_info: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Ca làm việc không được để trống' })
  @IsEnum(['Sáng', 'Tối', 'Cả ngày'], {
    message: 'Ca làm việc không hợp lệ (Sáng, Tối, Cả ngày)',
  })
  shift: string;

  @ApiProperty()
  avatar: string;
}
