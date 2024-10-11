import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

interface Accessories {
  table: [{ id: number; quantity: number; amount?: number }];
  chair: { id: number; amount?: number };
  extra_services: [{ id: number; quantity: number; amount?: number }];
}

interface ExtraServices {
  id: number;
  name?: string;
  description?: string;
  short_description?: string;
  images?: string[];
  quantity: number;
  amount?: number;
  total_price?: number;
}

export class UpdateBookingDto {
  @ApiProperty({ required: false })
  user_id: number;

  @ApiProperty({ required: true })
  branch_id: number;

  @ApiProperty({ required: true })
  party_type_id: number;

  @ApiProperty({ required: true })
  stage_id: number;

  @ApiProperty({ required: true })
  space_id: number;

  @ApiProperty({ required: true })
  decor_id: number;

  @ApiProperty({ required: true })
  menu_id: number;

  @ApiProperty({ required: true })
  @IsEnum(['cash', 'bank', 'momo', 'vnpay'], {
    message: 'Phương thức thanh toán không hợp lệ (cash, bank, momo, vnpay)',
  })
  payment_method: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  phone: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  company_name: string;

  @ApiProperty()
  number_of_guests: number;

  @ApiProperty({ required: true })
  note: string;

  @ApiProperty({
    example: {
      table: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 },
      ],
      chair: {
        id: 3,
      },
      extra_services: [
        { id: 4, quantity: 1 },
        { id: 5, quantity: 1 },
      ],
    },
  })
  accessories: Accessories;
  @ApiProperty({
    description:
      'Tổng tiền của sự kiện: Tiền trang trí + Tiền không gian + tiền ghế(10 * tổng bàn) + tổng tiền bàn + tiền menu(menu * tổng bàn) + phí',
  })
  amount: number;

  @ApiProperty({
    example: [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ],
    description:
      'Danh sách các dịch vụ khác (chỉ điền id và số lượng khi đã đặt cọc thành công)',
  })
  extra_sevice: [{ id: number; quantity: number }] | any;
  @ApiProperty({ required: true })
  is_confirm: boolean;

  @ApiProperty({ required: true })
  is_deposit: boolean;

  @ApiProperty({ required: true })
  @IsEnum(['pending', 'processing', 'success', 'cancel'], {
    message: 'Trạng thái không hợp lệ (pending, processing, success, cancel)',
  })
  status: string;

  @ApiProperty({ type: [String] })
  images: string[] | any;
}
