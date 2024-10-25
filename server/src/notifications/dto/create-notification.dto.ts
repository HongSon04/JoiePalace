import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TypeNotifyEnum } from 'helper/enum/type_notify.enum';

export class CreateNotificationDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'user_id không được để trống' })
  user_id: number;

  @ApiProperty({ required: true, enum: TypeNotifyEnum })
  @IsNotEmpty({ message: 'Loại thông báo không được để trống' })
  @IsEnum(TypeNotifyEnum, {
    message: `Loại thông báo không hợp lệ. Vui lòng chọn trong các giá trị sau: ${Object.values(
      TypeNotifyEnum,
    ).join(', ')}`,
  })
  type: TypeNotifyEnum;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content: string;
}
