import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ShiftEnum } from 'helper/enum/shift.enum';

export class ConfirmBookingMailDto {
  @ApiProperty({
    required: true,
    description: 'Ca tổ chức sự kiện',
    enum: ShiftEnum,
    example: ShiftEnum.SÁNG,
  })
  @IsNotEmpty({ message: 'Vui lòng chọn ca' })
  @IsEnum(ShiftEnum, {
    message: 'Ca tổ chức không hợp lệ (Sáng, Tối)',
  })
  shift: string;

  @ApiProperty({
    required: true,
    description: 'Ngày tổ chức sự kiện (định dạng: DD-MM-YYYY)',
    example: '30-12-2024',
  })
  @IsNotEmpty({ message: 'Vui lòng chọn ngày tổ chức sự kiện' })
  organization_date: string;

  @ApiProperty({
    description: 'Tên chi nhánh nơi tổ chức, không được để trống',
    example: 'Chi nhánh Hà Nội',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên chi nhánh không được để trống' })
  branchName: string;

  @ApiProperty({
    description: 'Tên khách hàng, không được để trống',
    example: 'Nguyễn Văn A',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên khách hàng không được để trống' })
  customerName: string;

  @ApiProperty({
    description: 'Email của khách hàng, không được để trống',
    example: 'nguyenvana@example.com',
    required: true,
  })
  @IsNotEmpty({ message: 'Email khách hàng không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  customerEmail: string;

  @ApiProperty({
    description: 'Số điện thoại của khách hàng, không được để trống',
    example: '+84123456789',
    required: true,
  })
  @IsNotEmpty({ message: 'Số điện thoại khách hàng không được để trống' })
  @IsPhoneNumber(null, { message: 'Số điện thoại không hợp lệ' })
  customerPhone: string;

  @ApiProperty({
    description: 'Địa chỉ chi nhánh, không được để trống',
    example: '123 Đường ABC, Quận 1, TP.HCM',
    required: true,
  })
  @IsNotEmpty({ message: 'Địa chỉ chi nhánh không được để trống' })
  branchAddress: string;
}
