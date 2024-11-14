import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateStatusNotificationDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Không được để trống ID thông báo!' })
  notification_ids: number[];
}
