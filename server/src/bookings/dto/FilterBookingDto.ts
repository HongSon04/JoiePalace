import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from 'helper/enum/booking_status.enum';

export class FilterBookingDto {
  @ApiProperty({
    required: false,
    description: 'Số trang hiện tại trong danh sách đơn tiệc',
    example: '1',
  })
  page?: string;

  @ApiProperty({
    required: false,
    description: 'Số lượng mục trên mỗi trang',
    example: '10',
  })
  itemsPerPage?: string;

  @ApiProperty({
    required: false,
    description: 'Từ khóa tìm kiếm trong danh sách đơn tiệc',
    example: 'Nguyễn Văn A',
  })
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Giá tối đa cho đơn tiệc',
    example: '1000000',
  })
  maxPrice?: string;

  @ApiProperty({
    required: false,
    description: 'Giá tối thiểu cho đơn tiệc',
    example: '500000',
  })
  minPrice?: string;

  @ApiProperty({
    required: false,
    description: 'Sắp xếp theo giá (tăng dần hoặc giảm dần)',
    example: 'asc',
  })
  priceSort?: string;

  @ApiProperty({
    required: false,
    description: 'Ngày bắt đầu của khoảng thời gian tìm kiếm',
    example: '2024-01-01',
  })
  startDate?: string;

  @ApiProperty({
    required: false,
    description: 'Ngày kết thúc của khoảng thời gian tìm kiếm',
    example: '2024-12-31',
  })
  endDate?: string;

  @ApiProperty({
    required: false,
    description: 'Trạng thái xác nhận của đơn tiệc',
    example: true,
  })
  is_confirm?: boolean;

  @ApiProperty({
    required: false,
    description: 'Trạng thái đặt cọc của đơn tiệc',
    example: true,
  })
  is_deposit?: boolean;

  @ApiProperty({
    required: false,
    description: 'Trạng thái của đơn tiệc',
    enum: BookingStatus,
    example: BookingStatus.PENDING,
  })
  status?: BookingStatus;
}
