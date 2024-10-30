import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterFeedBackDto {
  @ApiProperty({
    description: 'Số trang hiện tại, mặc định là 1',
    required: false,
  })
  @IsOptional()
  page?: string;

  @ApiProperty({
    description: 'Số lượng phản hồi trên mỗi trang, mặc định là 10',
    required: false,
  })
  @IsOptional()
  itemsPerPage?: string;

  @ApiProperty({
    description: 'ID của người dùng để lọc phản hồi',
    required: false,
  })
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    description: 'ID của booking để lọc phản hồi',
    required: false,
  })
  @IsOptional()
  booking_id?: string;

  @ApiProperty({
    description: 'Từ khóa tìm kiếm để lọc phản hồi',
    required: false,
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Ngày bắt đầu để lọc phản hồi (định dạng: YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'Ngày kết thúc để lọc phản hồi (định dạng: YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'ID của chi nhánh để lọc phản hồi',
    required: false,
  })
  @IsOptional()
  branch_id?: string;

  @ApiProperty({
    description:
      'Cho biết liệu phản hồi có được hiển thị hay không (true/false)',
    required: false,
  })
  @IsOptional()
  is_show?: boolean;

  @ApiProperty({
    description:
      'Cho biết liệu phản hồi có được phê duyệt hay không (true/false)',
    required: false,
  })
  @IsOptional()
  is_approved?: boolean;
}
