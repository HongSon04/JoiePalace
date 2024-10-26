import { Controller, Get, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FilterDto } from 'helper/dto/Filter.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@ApiTags('Notifications - Quản lý thông báo')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ! Get Notifications by user_id
  @Get('get/:user_id')
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiOperation({ summary: 'Lấy thông báo theo user_id' })
  async getNotifications(@Param('user_id') user_id: string, query: FilterDto) {
    return this.notificationsService.getNotifications(+user_id, query);
  }

  // ! Get Notifications by Email User
  @Get('get-by-email/:email_user')
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Lấy thông báo theo email_user' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  async getNotificationsByEmail(
    @Param('email_user') email_user: string,
    query: FilterDto,
  ) {
    return this.notificationsService.getNotificationsByEmail(email_user, query);
  }

  // ! Update Is Read Notification by ID
  @Patch('update-is-read/:notification_id')
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Cập nhật trạng thái đã đọc thông báo' })
  async updateIsReadNotification(@Param('notification_id') id: string) {
    return this.notificationsService.updateIsReadNotification(+id);
  }
}
