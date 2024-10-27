import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Chi nhánh không được để trống' })
  branch_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Đơn tiệc không được để trống' })
  booking_id: string;

  @ApiProperty({ required: false })
  user_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Đánh giá không được để trống' })
  @Min(1, { message: 'Đánh giá phải lớn hơn hoặc bằng 1' })
  @Max(5, { message: 'Đánh giá phải nhỏ hơn hoặc bằng 5' })
  rate: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  comments: string;

  @ApiProperty({ required: false })
  is_show: boolean;

  @ApiProperty({ required: false })
  is_approved: boolean;
}
