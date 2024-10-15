import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ required: false })
  user_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  branch_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Vui lòng chọn loại sự kiện' })
  party_type_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  company_name: string;

  @ApiProperty({ required: true })
  note: string;

  @ApiProperty({ required: false })
  number_of_guests: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Vui lòng chọn ca' })
  @IsEnum(['Sáng', 'Tối'], {
    message: 'Ca tổ chức không hợp lệ (Sáng, Tối)',
  })
  shift: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Vui lòng chọn ngày tổ chức sự kiện' })
  organization_date: string;
}
