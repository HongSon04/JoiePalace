import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ShiftEnum } from 'helper/enum/shift.enum';

export class CreateBookingDto {
  @ApiProperty({
    required: false,
    description: 'ID của người dùng (nếu có)',
  })
  user_id?: number;

  @ApiProperty({
    required: true,
    description: 'ID của chi nhánh nơi tổ chức sự kiện',
  })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  branch_id: string;

  @ApiProperty({
    required: true,
    description: 'ID của loại sự kiện',
  })
  @IsNotEmpty({ message: 'Vui lòng chọn loại sự kiện' })
  party_type_id: string;

  @ApiProperty({
    required: false,
    description: 'ID của sảnh (nếu có)',
  })
  stage_id?: string;

  @ApiProperty({
    required: true,
    description: 'Họ và tên của người đặt',
  })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  name: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại liên hệ',
  })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @ApiProperty({
    required: true,
    description: 'Địa chỉ email liên hệ',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({
    required: false,
    description: 'Tên công ty (nếu có)',
  })
  @IsOptional()
  company_name?: string;

  @ApiProperty({
    required: true,
    description: 'Ghi chú thêm về sự kiện',
  })
  note: string;

  @ApiProperty({
    required: false,
    description: 'Số lượng khách dự kiến',
  })
  number_of_guests?: number;

  @ApiProperty({
    required: false,
    description: 'Ngân sách dự kiến cho sự kiện',
  })
  budget?: string;

  @ApiProperty({
    required: true,
    description: 'Ca tổ chức sự kiện',
    enum: ShiftEnum,
  })
  @IsNotEmpty({ message: 'Vui lòng chọn ca' })
  @IsEnum(ShiftEnum, {
    message: 'Ca tổ chức không hợp lệ (Sáng, Tối)',
  })
  shift: string;

  @ApiProperty({
    required: true,
    description: 'Ngày tổ chức sự kiện (định dạng: DD-MM-YYYY)',
  })
  @IsNotEmpty({ message: 'Vui lòng chọn ngày tổ chức sự kiện' })
  organization_date: string;
}
