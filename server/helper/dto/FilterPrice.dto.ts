import { ApiProperty } from '@nestjs/swagger';

export class FilterPriceDto {
  @ApiProperty({ required: false, description: 'Trang hiện tại' })
  page?: string;

  @ApiProperty({
    required: false,
    description: 'Số lượng sản phẩm trên 1 trang',
  })
  itemsPerPage?: string;

  @ApiProperty({ required: false, description: 'Tìm kiếm' })
  search?: string;

  @ApiProperty({ required: false, description: 'Giá thấp nhất' })
  maxPrice?: string;

  @ApiProperty({
    required: false,
    description: 'Giá tối thiểu của sản phẩm khi lọc',
  })
  minPrice?: string;

  @ApiProperty({
    required: false,
    description: 'Giá tối đa của sản phẩm khi lọc',
  })
  priceSort?: string;

  @ApiProperty({
    required: false,
    description: 'Ngày bắt đầu (ngày tạo sản phẩm)',
  })
  startDate?: string;

  @ApiProperty({
    required: false,
    description: 'Ngày kết thúc (ngày tạo sản phẩm)',
  })
  endDate?: string;
}
