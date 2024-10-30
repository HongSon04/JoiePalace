import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsArray } from 'class-validator';

export class StageUpdateDto {
  @ApiProperty({
    required: false,
    description: 'ID của chi nhánh (nếu cần cập nhật)',
  })
  @IsOptional()
  branch_id?: number;

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
    description: 'Số lượng bàn tối thiểu (bắt buộc)',
  })
  capacity_min: number;

  @ApiProperty({
    type: Number,
    description: 'Số lượng bàn tối đa (bắt buộc)',
  })
  capacity_max: number;

  @ApiProperty({
    required: false,
    description: 'Danh sách các hình ảnh của sảnh (nếu cần cập nhật)',
  })
  images: string[];
}
