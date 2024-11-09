import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min, IsOptional } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'ID của chi nhánh, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Chi nhánh không được để trống' })
  branch_id: string;

  @ApiProperty({
    description: 'ID của đơn tiệc, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Đơn tiệc không được để trống' })
  booking_id: string;

  @ApiProperty({
    description: 'ID của người dùng (nếu có)',
    required: false,
  })
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    description: 'Tên của người gửi phản hồi, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @ApiProperty({
    description: 'Đánh giá từ 1 đến 5, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Đánh giá không được để trống' })
  @Min(1, { message: 'Đánh giá phải lớn hơn hoặc bằng 1' })
  @Max(5, { message: 'Đánh giá phải nhỏ hơn hoặc bằng 5' })
  rate: string;

  @ApiProperty({
    description: 'Nội dung phản hồi, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  comments: string;

  @ApiProperty({
    description: 'Phản hồi có hiển thị hay không',
    required: false,
  })
  @IsOptional()
  is_show?: boolean;

  @ApiProperty({
    description: 'Phản hồi đã được duyệt hay chưa',
    required: false,
  })
  @IsOptional()
  is_approved?: boolean;
}
