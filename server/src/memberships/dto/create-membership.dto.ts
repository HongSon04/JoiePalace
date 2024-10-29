import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMembershipDto {
  @ApiProperty({
    description: 'Tên hạng thành viên, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên hạng thành viên không được để trống' })
  name: string;

  @ApiProperty({
    description: 'Mô tả hạng thành viên, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả hạng thành viên không được để trống' })
  description: string;

  @ApiProperty({
    description: 'Ảnh hạng thành viên, không được để trống',
    required: true,
  })
  image: string[];

  @ApiProperty({
    description: 'Danh sách các ID quà tặng liên quan đến hạng thành viên',
    required: false,
  })
  gifts: number[];

  @ApiProperty({
    description: 'Tổng tiền đã đặt tiệc, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Tổng tiền đã đặt tiệc không được để trống' })
  booking_total_amount: number;
}
