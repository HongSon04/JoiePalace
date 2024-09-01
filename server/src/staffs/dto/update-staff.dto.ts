import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateStaffDto {
  @ApiProperty()
  location_id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  payment_info: string;
  @ApiProperty()
  @IsEnum(['Sáng', 'Tối', 'Cả ngày'], {
    message: 'Ca làm việc không hợp lệ (Sáng, Tối, Cả ngày)',
  })
  shift: string;

  @ApiProperty()
  avatar: string;
}
