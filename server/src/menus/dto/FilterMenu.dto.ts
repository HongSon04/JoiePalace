import { ApiProperty } from '@nestjs/swagger';

export class FilterMenuDto {
  @ApiProperty({ required: false, description: 'ID của khách hàng' })
  user_id: string;

  @ApiProperty({ required: false, description: 'Trang hiện tại' })
  page: string;

  @ApiProperty({
    required: false,
    description: 'Số lượng sản phẩm trên 1 trang',
  })
  itemsPerPage: string;

  @ApiProperty({ required: false, description: 'Tìm kiếm' })
  search: string;

  @ApiProperty({
    required: false,
    description: 'Giá tối đa của menu khi lọc',
  })
  maxPrice: string;

  @ApiProperty({ required: false, description: 'Giá tối thiểu của khi lọc' })
  minPrice: string;

  @ApiProperty({
    required: false,
    description: 'Sắp xếp theo giá',
    enum: ['ASC', 'DESC'],
  })
  priceSort: string;

  @ApiProperty({
    required: false,
    description: 'Ngày bắt đầu tạo menu',
  })
  startDate: string;

  @ApiProperty({
    required: false,
    description: 'Ngày kết thúc tạo menu',
  })
  endDate: string;

  @ApiProperty({
    required: false,
    description: 'Trạng thái hiển thị của menu',
    enum: ['true', 'false'],
  })
  is_show: string;
}
