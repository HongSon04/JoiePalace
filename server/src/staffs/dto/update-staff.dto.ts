import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateStaffDto {
  @ApiProperty({ required: true })
  branch_id: number;
  @ApiProperty({ required: true })
  name: string;
  @ApiProperty({ required: true })
  phone: string;
  @ApiProperty({ required: true })
  payment_info: string;
  @ApiProperty({ required: true })
  @IsEnum(['Sáng', 'Tối', 'Cả ngày'], {
    message: 'Ca làm việc không hợp lệ (Sáng, Tối, Cả ngày)',
  })
  shift: string;

  @ApiProperty({ required: true })
  avatar: string;
}
