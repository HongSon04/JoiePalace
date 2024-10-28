import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterFeedBackDto {
  @ApiProperty({
    description: 'Số trang hiện tại, mặc định là 1',
    example: '1',
    required: false,
  })
  @IsOptional()
  page: string;

  @ApiProperty({
    description: 'Số lượng phản hồi trên mỗi trang, mặc định là 10',
    example: '10',
    required: false,
  })
  @IsOptional()
  itemsPerPage: string;

  @ApiProperty({
    description: 'Từ khóa tìm kiếm để lọc phản hồi',
    example: 'dịch vụ tốt',
    required: false,
  })
  @IsOptional()
  search: string;

  @ApiProperty({
    description: 'Ngày bắt đầu để lọc phản hồi (định dạng: YYYY-MM-DD)',
    example: '2023-01-01',
    required: false,
  })
  @IsOptional()
  startDate: string;

  @ApiProperty({
    description: 'Ngày kết thúc để lọc phản hồi (định dạng: YYYY-MM-DD)',
    example: '2023-12-31',
    required: false,
  })
  @IsOptional()
  endDate: string;

  @ApiProperty({
    description: 'ID của chi nhánh để lọc phản hồi',
    example: 'branch_123',
    required: false,
  })
  @IsOptional()
  branch_id: string;

  @ApiProperty({
    description:
      'Cho biết liệu phản hồi có được hiển thị hay không (true/false)',
    example: 'true',
    required: false,
  })
  @IsOptional()
  is_show: string;

  @ApiProperty({
    description:
      'Cho biết liệu phản hồi có được phê duyệt hay không (true/false)',
    example: 'false',
    required: false,
  })
  @IsOptional()
  is_approved: string;
}
