import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TypeNotifyEnum } from 'helper/enum/type_notify.enum';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'ID của người dùng nhận thông báo, không được để trống',
    example: 123,
    required: true,
  })
  @IsNotEmpty({ message: 'Khách hàng không được để trống' })
  user_id: number;

  @ApiProperty({
    description: 'Loại thông báo, không được để trống',
    required: true,
    enum: TypeNotifyEnum,
  })
  @IsNotEmpty({ message: 'Loại thông báo không được để trống' })
  @IsEnum(TypeNotifyEnum, {
    message: `Loại thông báo không hợp lệ. Vui lòng chọn trong các giá trị sau: ${Object.values(
      TypeNotifyEnum,
    ).join(', ')}`,
  })
  type: TypeNotifyEnum;

  @ApiProperty({
    description: 'Tiêu đề của thông báo, không được để trống',
    example: 'Thông báo mới từ hệ thống',
    required: true,
  })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @ApiProperty({
    description: 'Nội dung của thông báo, không được để trống',
    example: 'Bạn có một thông báo mới từ hệ thống.',
    required: true,
  })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content: string;
}
