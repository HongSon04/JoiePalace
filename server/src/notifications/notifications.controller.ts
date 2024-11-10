import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
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
  async getNotifications(
    @Param('user_id') user_id: string,
    @Query() query: FilterDto,
  ) {
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
    @Query() query: FilterDto,
  ) {
    return this.notificationsService.getNotificationsByEmail(email_user, query);
  }

  // ! Update Is Read Notification by Multiple ID
  @Patch('update-is-read')
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Cập nhật trạng thái đã đọc thông báo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        notify_id: {
          type: 'array',
          items: {
            type: 'number',
          },
        },
      },
    },
  })
  async updateIsReadNotification(@Body('notify_id') notify_id: number[]) {
    return this.notificationsService.updateIsReadNotification(notify_id);
  }
}
