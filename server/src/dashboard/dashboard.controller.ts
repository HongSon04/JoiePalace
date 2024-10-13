import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { isPublic } from 'decorator/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  // ! Tổng doanh thu của tất cả các chi nhánh
  @isPublic()
  @Get('total-revenue-for-branch')
  async getTotalRevenueForBranch() {
    return this.dashboardService.getTotalRevenueForBranch();
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo tuần
  @isPublic()
  @Get('total-revenue-for-branch-by-week')
  async getTotalRevenueForBranchByWeek() {
    return this.dashboardService.getTotalRevenueForBranchByWeek();
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo tháng
  @isPublic()
  @Get('total-revenue-for-branch-by-month')
  async getTotalRevenueForBranchByMonth() {
    return this.dashboardService.getTotalRevenueForBranchByMonth();
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo năm
  @isPublic()
  @Get('total-revenue-for-branch-by-year')
  async getTotalRevenueForBranchByYear() {
    return this.dashboardService.getTotalRevenueForBranchByYear();
  }

  // ? Tổng hợp tất cả
  // ? Lấy tổng doanh thu(tuần, tháng, năm) của tất cả các chi nhánh, cùng với số lượng booking tương ứng
  // ? Lấy tổng số lượng user, booking(đã hủy, đang chờ, thành công), feedback,
}
