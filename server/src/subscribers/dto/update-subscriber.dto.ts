import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSubscriberDto } from './create-subscriber.dto';

export class UpdateSubscriberDto {
  @ApiProperty({ required: false })
  is_receive: boolean;

  @ApiProperty({ required: false })
  is_receive_sales: boolean;

  @ApiProperty({ required: false })
  is_receive_notify: boolean;

  @ApiProperty({ required: false })
  is_receive_blog: boolean;
}
