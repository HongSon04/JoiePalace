import { ApiProperty } from '@nestjs/swagger';

export class FilterCategoryDto {
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
