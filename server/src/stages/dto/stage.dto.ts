import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class StageDto {
  @ApiProperty({ type: Number, description: 'ID của chi nhánh' })
  @IsNotEmpty({ message: 'Branch ID không được để trống' })
  branch_id: string;

  @ApiProperty({
    type: String,
    description: 'Tên của sảnh',
  })
  @IsNotEmpty({ message: 'Tên sảnh không được để trống' })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Mô tả chi tiết về sảnh',
  })
  @IsNotEmpty({ message: 'Mô tả sảnh không được để trống' })
  description: string;

  @ApiProperty({
    type: Number,
    description: 'Số lượng bàn tối thiểu',
  })
  @IsNotEmpty({ message: 'Số lượng bàn tối thiểu không được để trống' })
  capacity_min: number;

  @ApiProperty({
    type: Number,
    description: 'Số lượng bàn tối đa',
  })
  @IsNotEmpty({ message: 'Số lượng bàn tối đa không được để trống' })
  capacity_max: number;

  @ApiProperty({
    type: [String],
    description: 'Danh sách các hình ảnh của sảnh',
  })
  images: string[];
}
