import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from 'helper/enum/booking_status.enum';

export class FilterBookingDto {
  @ApiProperty({
    required: false,
    description: 'Số trang hiện tại trong danh sách đơn tiệc',
  })
  page?: string;

  @ApiProperty({
    required: false,
    description: 'Số lượng mục trên mỗi trang',
  })
  itemsPerPage?: string;

  @ApiProperty({
    required: false,
    description: 'Từ khóa tìm kiếm trong danh sách đơn tiệc',
  })
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Giá tối đa cho đơn tiệc',
  })
  maxPrice?: string;

  @ApiProperty({
    required: false,
    description: 'Giá tối thiểu cho đơn tiệc',
  })
  minPrice?: string;

  @ApiProperty({
    required: false,
    description: 'Sắp xếp theo giá (tăng dần hoặc giảm dần)',
  })
  priceSort?: string;

  @ApiProperty({
    required: false,
    description: 'Ngày bắt đầu của khoảng thời gian tìm kiếm',
  })
  startDate?: string;

  @ApiProperty({
    required: false,
    description: 'Ngày kết thúc của khoảng thời gian tìm kiếm',
  })
  endDate?: string;

  @ApiProperty({
    required: false,
    description: 'Trạng thái xác nhận của đơn tiệc',
  })
  is_confirm?: boolean;

  @ApiProperty({
    required: false,
    description: 'Trạng thái đặt cọc của đơn tiệc',
  })
  is_deposit?: boolean;

  @ApiProperty({
    required: false,
    description: 'Trạng thái của đơn tiệc',
    enum: BookingStatus,
  })
  status?: BookingStatus;
}
