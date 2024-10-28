import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubscriberDto {
  @ApiProperty({
    required: false,
    description: 'Người đăng ký sẽ nhận được tất cả thông báo',
  })
  is_receive?: boolean;

  @ApiProperty({
    required: false,
    description: 'Người đăng ký sẽ nhận được thông báo khuyến mãi',
  })
  is_receive_sales?: boolean;

  @ApiProperty({
    required: false,
    description: 'Người đăng ký sẽ nhận được thông báo từ các thông báo khác',
  })
  is_receive_notify?: boolean;

  @ApiProperty({
    required: false,
    description: 'Người đăng ký sẽ nhận được thông báo từ bài viết',
  })
  is_receive_blog?: boolean;
}
