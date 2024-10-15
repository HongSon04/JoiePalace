import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { isPublic } from 'decorator/auth.decorator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  // ! Tổng số lượng user, branch, product, category, tags, staff,menus,decors,paryty_type,furniture
  // ! Tổng doanh thư của tất cả các chi nhánh
  @isPublic()
  @Get('total-revenue-for-all-branch')
  async getTotalRevenueForAllBranch() {
    return this.dashboardService.getTotalRevenueForAllBranch();
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo tuần
  @isPublic()
  @Get('total-revenue-for-all-branch-by-week')
  async getTotalRevenueForAllBranchByWeek() {
    return this.dashboardService.getTotalRevenueForAllBranchByWeek();
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo tháng
  @isPublic()
  @Get('total-revenue-for-all-branch-by-month')
  async getTotalRevenueForAllBranchByMonth() {
    return this.dashboardService.getTotalRevenueForAllBranchByMonth();
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo năm
  @isPublic()
  @Get('total-revenue-for-all-branch-by-year')
  async getTotalRevenueForAllBranchByYear() {
    return this.dashboardService.getTotalRevenueForAllBranchByYear();
  }

  // ! Tổng doanh thu từng tháng trong năm của tất cả các chi nhánh
  @isPublic()
  @Get('total-revenue-for-all-branch-each-month')
  async getTotalRevenueForAllBranchEachMonth() {
    return this.dashboardService.getTotalRevenueForAllBranchEachMonth();
  }

  // ! Thống kê tiệc đang pending, success, cancel, processing của tất cả các chi nhánh
  @isPublic()
  @Get('count-booking-status-for-all-branch')
  async countBookingStatusForBranch() {
    return this.dashboardService.countBookingStatusForAllBranch();
  }

  // ! Tổng doanh thu của từng chi nhánh
  @isPublic()
  @Get('total-revenue-for-each-branch')
  async getTotalRevenueForEachBranch() {
    return this.dashboardService.getTotalRevenueForEachBranch();
  }

  // ! Tổng doanh thu của từng chi nhánh theo tuần
  @isPublic()
  @Get('total-revenue-for-each-branch-by-week')
  async getTotalRevenueForEachBranchByWeek() {
    return this.dashboardService.getTotalRevenueForEachBranchByWeek();
  }

  // ! Tổng doanh thu của từng chi nhánh theo tháng
  @isPublic()
  @Get('total-revenue-for-each-branch-by-month')
  async getTotalRevenueForEachBranchByMonth() {
    return this.dashboardService.getTotalRevenueForEachBranchByMonth();
  }

  // ! Tổng doanh thu của từng chi nhánh theo năm
  @isPublic()
  @Get('total-revenue-for-each-branch-by-year')
  async getTotalRevenueForEachBranchByYear() {
    return this.dashboardService.getTotalRevenueForEachBranchByYear();
  }

  // ! Tổng doanh thu từng tháng trong năm của tất cả các chi nhánh
  @isPublic()
  @Get('total-revenue-for-each-branch-each-month')
  async getTotalRevenueForEachBranchEachMonth() {
    return this.dashboardService.getTotalRevenueForEachBranchEachMonth();
  }

  // ! Thống kê tiệc đang pending, success, cancel, processing của từng các chi nhánh
  @isPublic()
  @Get('count-booking-status-for-each-branch')
  async countBookingStatus() {
    return this.dashboardService.countBookingStatus();
  }
}
