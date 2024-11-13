import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class StageUpdateDto {
  @ApiProperty({
    required: false,
    description: 'ID của chi nhánh (nếu cần cập nhật)',
  })
  @IsOptional()
  branch_id?: string;

  @ApiProperty({
    required: false,
    description: 'Tên của sảnh (nếu cần cập nhật)',
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Mô tả chi tiết về sảnh (nếu cần cập nhật)',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'Số lượng bàn tối thiểu (bắt buộc)',
  })
  capacity_min?: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'Số lượng bàn tối đa (bắt buộc)',
  })
  capacity_max?: string;

  @ApiProperty({
    required: false,

    description: 'Danh sách các hình ảnh của sảnh (nếu cần cập nhật)',
  })
  images: string[];

  @ApiProperty({
    type: Number,
    required: false,
    description: 'Giá thuê sảnh',
  })
  price?: string;
}
