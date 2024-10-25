import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { isPublic } from 'decorator/auth.decorator';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Dashboard - Quản lý dashboard')
@ApiBearerAuth('authorization')
@ApiHeaders([
  {
    name: 'authorization',
    description: 'Bearer token',
    required: false,
  },
])
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  // ! Lấy tất cả thông tin của dashboard (tất cả các chi nhánh)
  @Get('get-all-info')
  @isPublic()
  @ApiOperation({
    summary: 'Lấy tất cả thông tin của dashboard (tổng tất cả chi nhánh)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả thông tin của dashboard',
    example: {
      count_all_info: {
        count_user: 0,
        count_branch: 0,
        count_product: 0,
        count_category: 0,
        count_tags: 0,
        count_staff: 0,
        count_menus: 0,
        count_decors: 0,
        count_party_type: 0,
        count_furniture: 0,
      },
      total_revune_by_week: 0,
      total_revune_by_month: 0,
      total_revune_by_year: 0,
      total_revune_each_month: [],
      count_booking_status: {
        count_pending: 0,
        count_success: 0,
        count_cancel: 0,
        count_processing: 0,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async getAllInfo() {
    return this.dashboardService.getAllInfo();
  }

  // ! Lấy tất cả thông tin của dashboard (tất cả các chi nhánh theo từng ngày, tuần, tháng, năm)
  @Get('get-all-info-by-each-time/:branch_id')
  @isPublic()
  @ApiOperation({
    summary:
      'Lấy tất cả thông tin của dashboard (tổng từng chi nhánh hoặc id chi nhánh theo từng ngày, tuần, tháng, năm)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy tất cả thông tin của dashboard',
    example: {
      count_all_info: {
        totalUser: 8708,
        totalBranch: 10,
        totalProduct: 107,
        totalCategory: 4,
        totalTags: 0,
        totalStaff: 0,
        totalMenus: 0,
        totalDecors: 0,
        totalPartyType: 1,
        totalFurniture: 0,
        totalFeedBack: 0,
      },
      total_revune: {
        'Hà Nội': 0,
        'Hồ Chí Minh': 0,
      },
      total_revune_by_week: {
        'Hà Nội': 0,
        'Hồ Chí Minh': 0,
      },
      total_revune_by_month: {
        'Hà Nội': 0,
        'Hồ Chí Minh': 0,
      },
      total_revune_by_year: {
        'Hà Nội': 0,
        'Hồ Chí Minh': 0,
      },
      total_revune_each_month: [
        {
          name: 'Hà Nội',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          total: 0,
        },
      ],
      count_booking_status: [
        {
          name: 'Hà Nội',
          data: {
            pending: 1,
            success: 0,
            cancel: 0,
            processing: 0,
          },
        },
        {
          name: 'Hồ Chí Minh',
          data: {
            pending: 0,
            success: 0,
            cancel: 0,
            processing: 0,
          },
        },
        {
          name: 'Đà Nẵng',
          data: {
            pending: 0,
            success: 0,
            cancel: 0,
            processing: 0,
          },
        },
        {
          name: 'Hải Phòng',
          data: {
            pending: 0,
            success: 0,
            cancel: 0,
            processing: 0,
          },
        },
        {
          name: 'Cần Thơ',
          data: {
            pending: 0,
            success: 0,
            cancel: 0,
            processing: 0,
          },
        },
        {
          name: 'Hà Tĩnh',
          data: {
            pending: 0,
            success: 0,
            cancel: 0,
            processing: 0,
          },
        },
        {
          name: 'Hà Nam',
          data: {
            pending: 0,
            success: 0,
            cancel: 0,
            processing: 0,
          },
        },
        {
          name: 'Hà Đông',
          data: {
            pending: 0,
            success: 0,
            cancel: 0,
            processing: 0,
          },
        },
        {
          name: 'Hà Tây',
          data: {
            pending: 0,
            success: 0,
            cancel: 0,
            processing: 0,
          },
        },
        {
          name: 'Cao Bằng',
          data: {
            pending: 0,
            success: 0,
            cancel: 0,
            processing: 0,
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  @ApiParam({ name: 'branch_id', required: false })
  async getAllInfoByEachTime(@Param('branch_id') branch_id: string) {
    return this.dashboardService.getAllInfoByEachTime(+branch_id);
  }

  // ! Tổng số lượng user, branch, product, category, tags, staff,menus,decors,party_type,furniture
  @Get('count-all')
  @isPublic()
  @ApiOperation({
    summary:
      'Tổng số lượng user, branch, product, category, tags, staff,menus,decors,party_type,furniture',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Tổng số lượng user, branch, product, category, tags, staff,menus,decors,party_type,furniture',
    example: {
      totalUser: 8708,
      totalBranch: 10,
      totalProduct: 107,
      totalCategory: 4,
      totalTags: 0,
      totalStaff: 0,
      totalMenus: 0,
      totalDecors: 0,
      totalPartyType: 1,
      totalFurniture: 0,
      totalFeedBack: 0,
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async countAll() {
    return this.dashboardService.countAll();
  }
  // ! Tổng doanh thu của tất cả các chi nhánh
  @Get('total-revenue-for-all-branch')
  @isPublic()
  @ApiOperation({
    summary: 'Tổng doanh thu của tất cả các chi nhánh',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tổng doanh thu của tất cả các chi nhánh',
    example: 0,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async getTotalRevenueForAllBranch() {
    return this.dashboardService.getTotalRevenueForAllBranch();
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo tuần
  @Get('total-revenue-for-all-branch-by-week')
  @isPublic()
  @ApiOperation({
    summary: 'Tổng doanh thu của tất cả các chi nhánh theo tuần',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tổng doanh thu của tất cả các chi nhánh theo tuần',
    example: 0,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async getTotalRevenueForAllBranchByWeek() {
    return this.dashboardService.getTotalRevenueForAllBranchByWeek();
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo tháng
  @Get('total-revenue-for-all-branch-by-month')
  @isPublic()
  @ApiOperation({
    summary: 'Tổng doanh thu của tất cả các chi nhánh theo tháng',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tổng doanh thu của tất cả các chi nhánh theo tháng',
    example: 0,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async getTotalRevenueForAllBranchByMonth() {
    return this.dashboardService.getTotalRevenueForAllBranchByMonth();
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo quý
  @Get('total-revenue-for-all-branch-by-quarter')
  @isPublic()
  @ApiOperation({
    summary: 'Tổng doanh thu của tất cả các chi nhánh theo quý',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tổng doanh thu của tất cả các chi nhánh theo quý',
    example: 0,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async getTotalRevenueForAllBranchByQuarter() {
    return this.dashboardService.getTotalRevenueForAllBranchByQuarter();
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo năm
  @Get('total-revenue-for-all-branch-by-year')
  @isPublic()
  @ApiOperation({
    summary: 'Tổng doanh thu của tất cả các chi nhánh theo năm',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tổng doanh thu của tất cả các chi nhánh theo năm',
    example: 0,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async getTotalRevenueForAllBranchByYear() {
    return this.dashboardService.getTotalRevenueForAllBranchByYear();
  }

  // ! Tổng doanh thu từng tháng trong năm của tất cả các chi nhánh
  @Get('total-revenue-for-all-branch-each-month')
  @isPublic()
  @ApiOperation({
    summary: 'Tổng doanh thu từng tháng trong năm của tất cả các chi nhánh',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tổng doanh thu từng tháng trong năm của tất cả các chi nhánh',
    example: [
      {
        name: 'Hà Nội',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 0,
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async getTotalRevenueForAllBranchEachMonth() {
    return this.dashboardService.getTotalRevenueForAllBranchEachMonth();
  }

  // ! Thống kê tiệc đang pending, success, cancel, processing của tất cả các chi nhánh
  @Get('count-booking-status-for-all-branch')
  @isPublic()
  @ApiOperation({
    summary:
      'Thống kê tiệc đang pending, success, cancel, processing của tất cả các chi nhánh',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Thống kê tiệc đang pending, success, cancel, processing của tất cả các chi nhánh',
    example: {
      pending: 0,
      success: 0,
      cancel: 0,
      processing: 0,
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async countBookingStatusForBranch() {
    return this.dashboardService.countBookingStatusForAllBranch();
  }

  // ! Tổng doanh thu của từng chi nhánh
  @Get('total-revenue-for-each-branch/:branch_id')
  @isPublic()
  @ApiParam({ name: 'branch_id', required: false })
  @ApiOperation({
    summary: 'Tổng doanh thu của từng chi nhánh',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tổng doanh thu của từng chi nhánh',
    example: {
      'Hà Nội': 0,
      'Hồ Chí Minh': 0,
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async getTotalRevenueForEachBranch(@Param('branch_id') branch_id: string) {
    return this.dashboardService.getTotalRevenueForEachBranch(+branch_id);
  }

  // ! Tổng doanh thu của từng chi nhánh theo tuần
  @Get('total-revenue-for-each-branch-by-week/:branch_id')
  @isPublic()
  @ApiParam({ name: 'branch_id', required: false })
  @ApiOperation({
    summary: 'Tổng doanh thu của từng chi nhánh theo tuần',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tổng doanh thu của từng chi nhánh theo tuần',
    example: {
      'Hà Nội': 0,
      'Hồ Chí Minh': 0,
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async getTotalRevenueForEachBranchByWeek(
    @Param('branch_id') branch_id: string,
  ) {
    return this.dashboardService.getTotalRevenueForEachBranchByWeek(+branch_id);
  }

  // ! Tổng doanh thu của từng chi nhánh theo tháng
  @Get('total-revenue-for-each-branch-by-month/:branch_id')
  @isPublic()
  @ApiParam({ name: 'branch_id', required: false })
  @ApiOperation({
    summary: 'Tổng doanh thu của từng chi nhánh theo tháng',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tổng doanh thu của từng chi nhánh theo tháng',
    example: {
      'Hà Nội': 0,
      'Hồ Chí Minh': 0,
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async getTotalRevenueForEachBranchByMonth(
    @Param('branch_id') branch_id: string,
  ) {
    return this.dashboardService.getTotalRevenueForEachBranchByMonth(
      +branch_id,
    );
  }

  // ! Tổng doanh thu của từng chi nhánh theo quý
  @Get('total-revenue-for-each-branch-by-quarter/:branch_id')
  @isPublic()
  @ApiParam({ name: 'branch_id', required: false })
  @ApiOperation({
    summary: 'Tổng doanh thu của từng chi nhánh theo quý',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tổng doanh thu của từng chi nhánh theo quý',
    example: {
      'Hà Nội': [0, 0, 0, 0],
      'Hồ Chí Minh': [0, 0, 0, 0],
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async getTotalRevenueForEachBranchByQuarter(
    @Param('branch_id') branch_id: string,
  ) {
    return this.dashboardService.getTotalRevenueForEachBranchByQuarter(
      +branch_id,
    );
  }

  // ! Tổng doanh thu của từng chi nhánh theo năm
  @Get('total-revenue-for-each-branch-by-year/:branch_id')
  @isPublic()
  @ApiParam({ name: 'branch_id', required: false })
  @ApiOperation({
    summary: 'Tổng doanh thu của từng chi nhánh theo năm',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tổng doanh thu của từng chi nhánh theo năm',
    example: {
      'Hà Nội': 0,
      'Hồ Chí Minh': 0,
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async getTotalRevenueForEachBranchByYear(
    @Param('branch_id') branch_id: string,
  ) {
    return this.dashboardService.getTotalRevenueForEachBranchByYear(+branch_id);
  }

  // ! Tổng doanh thu từng tháng trong năm của từng chi nhánh
  @Get('total-revenue-for-each-branch-each-month/:branch_id')
  @isPublic()
  @ApiParam({ name: 'branch_id', required: false })
  @ApiOperation({
    summary: 'Tổng doanh thu từng tháng trong năm của từng chi nhánh',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tổng doanh thu từng tháng trong năm của từng chi nhánh',
    example: [
      {
        name: 'Hà Nội',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
  })
  async getTotalRevenueForEachBranchEachMonth(
    @Param('branch_id') branch_id: string,
  ) {
    return this.dashboardService.getTotalRevenueForEachBranchEachMonth(
      +branch_id,
    );
  }

  // ! Thống kê tiệc đang pending, success, cancel, processing của từng chi nhánh
  @Get('count-booking-status-for-each-branch/:branch_id')
  @isPublic()
  @ApiParam({ name: 'branch_id', required: false })
  @ApiOperation({
    summary:
      'Thống kê tiệc đang pending, success, cancel, processing của từng chi nhánh',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Thống kê tiệc đang pending, success, cancel, processing của từng chi nhánh',
    example: [
      {
        name: 'Hà Nội',
        data: {
          pending: 1,
          success: 0,
          cancel: 0,
          processing: 0,
        },
      },
    ],
  })
  async countBookingStatus(@Param('branch_id') branch_id: string) {
    return this.dashboardService.countBookingStatus(+branch_id);
  }
}
