import { ApiProperty } from '@nestjs/swagger';

export class FilterDto {
  @ApiProperty({ required: false, description: 'Trang hiện tại' })
  page?: string;

  @ApiProperty({
    required: false,
    description: 'Số lượng sản phẩm trên 1 trang',
  })
  itemsPerPage?: string;

  @ApiProperty({ required: false, description: 'Tìm kiếm' })
  search?: string;

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
