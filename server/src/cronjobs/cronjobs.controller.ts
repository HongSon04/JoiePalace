import { Controller } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { Cron } from '@nestjs/schedule';

@Controller('cronjobs')
export class CronjobsController {
  constructor(private readonly cronjobsService: CronjobsService) {}

  // ? Cronjobn auto delete token run every 15 minutes
  @Cron('0 */15 * * * *')
  deleteTokenExpired() {
    return this.cronjobsService.deleteTokenExpired();
  }

  // ? Cron Job check booking expired_at and delete it run every 2 hours
  @Cron('0 */2 * * *')
  handleBookingExpiredCron() {
    return this.cronjobsService.handleBookingExpiredCron();
  }

  // ? Send Email Deposit if status is pending run every day at 8:00 AM
  @Cron('0 8 * * *')
  handleDepositEmailCron() {
    return this.cronjobsService.handleDepositEmailCron();
  }
}
