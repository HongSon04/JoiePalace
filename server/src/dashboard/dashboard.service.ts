import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    dayjs.locale('vi');
    dayjs.extend(weekOfYear);
  }

  // ! Lấy tất cả thông tin của dashboard (tất cả các chi nhánh)
  async getAllInfo() {
    try {
      // Kiểm tra xem dữ liệu đã được cache chưa
      const cachedData = await this.cacheManager.get('getAllInfo');
      if (cachedData) {
        return cachedData; // Trả về dữ liệu từ cache
      }

      const count_all_info = await this.countAll();

      const promises = [
        this.getTotalRevenueForAllBranchByWeek(),
        this.getTotalRevenueForAllBranchByMonth(),
        this.getTotalRevenueForAllBranchByQuarter(),
        this.getTotalRevenueForAllBranchByYear(),
        this.getTotalRevenueForAllBranchEachMonth(),
        this.countBookingStatusForAllBranch(),
      ];

      const [
        total_revune_by_week,
        total_revune_by_month,
        total_revune_by_quarter,
        total_revune_by_year,
        total_revune_each_month,
        count_booking_status,
      ] = await Promise.all(promises);

      await this.cacheManager.set('getAllInfo', {
        count_all_info,
        total_revune_by_week,
        total_revune_by_month,
        total_revune_by_quarter,
        total_revune_by_year,
        total_revune_each_month,
        count_booking_status,
      });
      return {
        count_all_info,
        total_revune_by_week,
        total_revune_by_month,
        total_revune_by_quarter,
        total_revune_by_year,
        total_revune_each_month,
        count_booking_status,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ dashboardService -> getAllInfo: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Lấy tất cả thông tin của dashboard (tất cả các chi nhánh theo từng ngày, tuần, tháng, năm)
  async getAllInfoByEachTime(branch_id: number) {
    try {
      const count_all_info = await this.countAll();

      const promises = [
        this.getTotalRevenueForEachBranch(branch_id),
        this.getTotalRevenueForEachBranchByWeek(branch_id),
        this.getTotalRevenueForEachBranchByMonth(branch_id),
        this.getTotalRevenueForEachBranchByQuarter(branch_id),
        this.getTotalRevenueForEachBranchByYear(branch_id),
        this.getTotalRevenueForEachBranchEachMonth(branch_id),
        this.countBookingStatus(branch_id),
      ];

      const [
        total_revune,
        total_revune_by_week,
        total_revune_by_month,
        total_revune_by_quarter,
        total_revune_by_year,
        total_revune_each_month,
        count_booking_status,
      ] = await Promise.all(promises);

      return {
        count_all_info,
        total_revune,
        total_revune_by_week,
        total_revune_by_month,
        total_revune_by_quarter,
        total_revune_by_year,
        total_revune_each_month,
        count_booking_status,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ dashboardService -> getAllInfoByEachTime: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Lấy tổng thông tin của dashboard theo tháng
  async getDashboardGeneralInfoByMonth(branch_id: number) {
    try {
      // Kiểm tra xem dữ liệu đã được cache chưa
      const cachedData = await this.cacheManager.get(
        'getDashboardGeneralInfoByMonth',
      );
      if (cachedData) {
        return cachedData; // Trả về dữ liệu từ cache
      }
      let totalUser = 0;
      let totalPendingBooking = 0;
      let totalFutureBooking = 0;
      let totalSuccessBooking = 0;
      let totalCancelBooking = 0;
      let totalBooking = 0;
      // Lấy thời gian đầu và cuối tháng
      const now = dayjs();
      const startOfMonth = now.startOf('month').toDate();
      const endOfMonth = now.endOf('month').toDate();

      // Lấy tổng số lượng user
      totalUser = await this.prismaService.users.count({
        where: {
          deleted: false,
          created_at: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });

      // Lấy tổng số lượng booking theo trạng thái
      const bookingCounts = await this.prismaService.bookings.groupBy({
        by: ['status', 'is_confirm'],
        where: {
          created_at: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          deleted: false,
          branch_id: branch_id ? { equals: branch_id } : undefined,
        },
        _count: {
          status: true,
        },
      });

      // Tính tổng số lượng booking theo trạng thái
      bookingCounts.forEach((booking) => {
        switch (booking.status) {
          case 'pending':
            totalPendingBooking = booking._count.status;
            break;
          case 'success':
            totalSuccessBooking = booking._count.status;
            break;
          case 'cancel':
            totalCancelBooking = booking._count.status;
            break;
        }
        switch (booking.is_confirm) {
          case true:
            totalFutureBooking = booking._count.status;
            break;
        }
      });

      // Tính tổng số lượng booking
      totalBooking =
        totalPendingBooking + totalSuccessBooking + totalCancelBooking;

      // Lưu vào cache
      await this.cacheManager.set('getDashboardGeneralInfoByMonth', {
        totalUser,
        totalPendingBooking,
        totalFutureBooking,
        totalSuccessBooking,
        totalCancelBooking,
        totalBooking,
      });

      return {
        totalUser,
        totalPendingBooking,
        totalFutureBooking,
        totalSuccessBooking,
        totalCancelBooking,
        totalBooking,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getDashboardGeneralInfoByMonth: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Tổng số lượng user, branch, product, category, tags, staff,menus,decors,party_type,furniture
  async countAll() {
    try {
      const [
        totalUser,
        totalBranch,
        totalProduct,
        totalCategory,
        totalTags,
        totalMenus,
        totalDecors,
        totalPartyType,
        totalFeedBack,
      ] = await Promise.all([
        this.prismaService.users.count(),
        this.prismaService.branches.count(),
        this.prismaService.products.count(),
        this.prismaService.categories.count(),
        this.prismaService.tags.count(),
        this.prismaService.menus.count(),
        this.prismaService.decors.count(),
        this.prismaService.party_types.count(),
        this.prismaService.feedbacks.count(),
      ]);

      return {
        totalUser,
        totalBranch,
        totalProduct,
        totalCategory,
        totalTags,
        totalMenus,
        totalDecors,
        totalPartyType,
        totalFeedBack,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ dashboardService -> countAll: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Tổng doanh thu của tất cả các chi nhánh
  async getTotalRevenueForAllBranch() {
    try {
      // Tính tổng trực tiếp từ database bằng aggregation
      const result = await this.prismaService.booking_details.aggregate({
        where: {
          bookings: {
            status: 'success',
            deleted: false,
          },
        },
        _sum: {
          total_amount: true,
        },
      });

      // Trả về kết quả, mặc định là 0 nếu không có dữ liệu
      return Number(result._sum.total_amount || 0);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForAllBranch: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo tuần
  async getTotalRevenueForAllBranchByWeek(): Promise<number> {
    try {
      // Lấy thời gian đầu và cuối tuần
      const now = dayjs();
      const startOfWeek = now.startOf('week').toDate();
      const endOfWeek = now.endOf('week').toDate();

      // Tính tổng doanh thu trực tiếp từ database bằng aggregation
      const result = await this.prismaService.booking_details.aggregate({
        where: {
          bookings: {
            created_at: {
              gte: startOfWeek,
              lte: endOfWeek,
            },
            status: 'success',
            deleted: false,
          },
        },
        _sum: {
          total_amount: true,
        },
      });

      // Trả về kết quả, mặc định là 0 nếu không có dữ liệu
      return Number(result._sum.total_amount || 0);
    } catch (error) {
      // Log lỗi ra console để debug
      console.error(
        'Lỗi từ dashboardService -> getTotalRevenueForAllBranchByWeek: ',
        error,
      );

      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo tháng
  async getTotalRevenueForAllBranchByMonth() {
    try {
      // Lấy thời gian đầu và cuối tháng
      const now = dayjs();
      const startOfMonth = now.startOf('month').toDate();
      const endOfMonth = now.endOf('month').toDate();

      // Tính tổng doanh thu trực tiếp từ database bằng aggregation
      const result = await this.prismaService.booking_details.aggregate({
        where: {
          bookings: {
            created_at: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
            status: 'success',
            deleted: false,
          },
        },
        _sum: {
          total_amount: true,
        },
      });

      // Trả về kết quả, mặc định là 0 nếu không có dữ liệu
      return Number(result._sum.total_amount || 0);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForAllBranchByMonth: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo quý
  async getTotalRevenueForAllBranchByQuarter() {
    try {
      // Step 1: Get the start and end dates for the current year
      const now = dayjs();
      const startOfYear = now.startOf('year').toDate();
      const endOfYear = now.endOf('year').toDate();

      // Step 2: Use Prisma groupBy to calculate monthly total revenue from the database
      const monthlyRevenue = await this.prismaService.booking_details.groupBy({
        by: ['created_at'],
        where: {
          bookings: {
            created_at: {
              gte: startOfYear,
              lte: endOfYear,
            },
            status: 'success',
            deleted: false,
          },
        },
        _sum: {
          total_amount: true,
        },
      });

      // Step 3: Initialize an array to hold revenue for each quarter
      const quarterlyRevenue = [0, 0, 0, 0];

      // Step 4: Aggregate revenue by quarter
      monthlyRevenue.forEach((month) => {
        const quarterIndex = Math.floor(dayjs(month.created_at).month() / 3);
        quarterlyRevenue[quarterIndex] += Number(month._sum.total_amount) || 0;
      });

      return quarterlyRevenue;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForAllBranchByQuarter: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo năm
  async getTotalRevenueForAllBranchByYear() {
    try {
      // B1: Lấy ngày bắt đầu và kết thúc của năm hiện tại
      const now = dayjs();
      const startOfYear = now.startOf('year').toDate();
      const endOfYear = now.endOf('year').toDate();

      // B2: Sử dụng aggregation thay vì findMany để tính tổng
      const result = await this.prismaService.booking_details.aggregate({
        where: {
          bookings: {
            created_at: {
              gte: startOfYear,
              lte: endOfYear,
            },
            status: 'success',
            deleted: false,
          },
        },
        _sum: {
          total_amount: true,
        },
      });

      return result._sum.total_amount || 0;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForAllBranchByYear: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Tổng doanh thu từng tháng trong năm của tất cả các chi nhánh
  async getTotalRevenueForAllBranchEachMonth() {
    try {
      const startOfYear = dayjs().startOf('year').toDate();
      const endOfYear = dayjs().endOf('year').toDate();

      // B1: Use aggregation to calculate monthly revenue directly in the database
      const monthlyRevenue = await this.prismaService.booking_details.groupBy({
        by: ['created_at'],
        where: {
          bookings: {
            created_at: {
              gte: startOfYear,
              lte: endOfYear,
            },
            status: 'success',
            deleted: false,
          },
        },
        _sum: {
          total_amount: true,
        },
      });

      // B2: Initialize an array with 12 months set to 0
      const revenueData = Array(12).fill(0);

      // B3: Calculate revenue for each month
      monthlyRevenue.forEach((record) => {
        const month = dayjs(record.created_at).month();
        revenueData[month] += Number(record._sum.total_amount) || 0;
      });

      return revenueData;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForAllBranchEachMonth: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Thống kê tiệc đang pending, success, cancel, processing của tất cả các chi nhánh
  async countBookingStatusForAllBranch() {
    try {
      // B1: Sử dụng Prisma groupBy để đếm số lượng theo trạng thái trực tiếp từ database
      const bookingCounts = await this.prismaService.bookings.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      });

      // B2: Khởi tạo đối tượng với các trạng thái ban đầu bằng 0
      const data = {
        pending: 0,
        success: 0,
        cancel: 0,
        processing: 0,
      };

      // B3: Duyệt qua kết quả từ groupBy và gán số lượng vào các trạng thái tương ứng
      bookingCounts.forEach((booking) => {
        data[booking.status] = booking._count.status || 0;
      });

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> countBookingStatusForAllBranch: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Tổng doanh thu của từng chi nhánh
  async getTotalRevenueForEachBranch(branch_id: number) {
    try {
      // B1: Lấy chi nhánh với điều kiện tùy chọn
      const branches = await this.prismaService.branches.findMany({
        where: branch_id ? { id: Number(branch_id) } : undefined,
      });

      if (branch_id && branches.length === 0) {
        throw new HttpException(
          'Không tìm thấy chi nhánh',
          HttpStatus.NOT_FOUND,
        );
      }

      // B2: Lấy bookings và tính tổng từ booking_details
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          branch_id: {
            in: branches.map((branch) => branch.id),
          },
          status: 'success',
          deleted: false,
        },
        include: {
          booking_details: {
            select: {
              total_amount: true,
            },
          },
        },
      });

      // B3: Tính tổng doanh thu cho từng chi nhánh
      const branchRevenues = bookings.reduce(
        (acc, booking) => {
          const totalAmount = booking.booking_details.reduce(
            (sum, detail) => sum + (detail.total_amount || 0),
            0,
          );

          acc[booking.branch_id] = (acc[booking.branch_id] || 0) + totalAmount;
          return acc;
        },
        {} as Record<number, number>,
      );

      // B4: Tạo kết quả với tên chi nhánh
      const result = branches.reduce(
        (acc, branch) => {
          acc[branch.name] = branchRevenues[branch.id] || 0;
          return acc;
        },
        {} as Record<string, number>,
      );

      return branch_id > 0 ? result : this.transformBranchData(result);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForEachBranch: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Tổng doanh thu của từng chi nhánh theo tuần
  async getTotalRevenueForEachBranchByWeek(branch_id: number) {
    try {
      const data = {};
      let branches;

      // B1: Lấy tất cả các chi nhánh hoặc chi nhánh cụ thể
      if (!branch_id) {
        branches = await this.prismaService.branches.findMany();
      } else {
        const branch = await this.prismaService.branches.findUnique({
          where: {
            id: Number(branch_id),
          },
        });
        if (!branch) {
          throw new HttpException(
            'Không tìm thấy chi nhánh',
            HttpStatus.NOT_FOUND,
          );
        }
        branches = [branch]; // Chỉ lấy chi nhánh cụ thể
      }

      // B2: Lấy ngày bắt đầu và kết thúc của tuần
      const now = new Date();
      const startOfWeek = dayjs(now).startOf('week').toDate();
      const endOfWeek = dayjs(now).endOf('week').toDate();

      // B3: Lấy tất cả các booking cho từng chi nhánh trong một truy vấn
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          branch_id: {
            in: branches.map((branch) => Number(branch.id)),
          },
          created_at: {
            gte: startOfWeek,
            lte: endOfWeek,
          },
        },
        include: {
          booking_details: {
            select: {
              total_amount: true,
            },
          },
        },
      });

      // B4: Tính tổng doanh thu cho từng chi nhánh
      const revenueMap = {};
      bookings.forEach((booking) => {
        const total_price = booking.booking_details.reduce(
          (innerAcc, cur) => innerAcc + cur.total_amount,
          0,
        );
        revenueMap[booking.branch_id] =
          (revenueMap[booking.branch_id] || 0) + Number(total_price);
      });

      // Gán doanh thu cho từng chi nhánh
      branches.forEach((branch) => {
        data[branch.name] = revenueMap[branch.id] || 0; // Nếu không có booking, gán 0
      });

      return branch_id > 0 ? data : this.transformBranchData(data);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForEachBranchByWeek: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Tổng doanh thu của từng chi nhánh theo tháng
  async getTotalRevenueForEachBranchByMonth(branch_id: number) {
    try {
      // B1: Lấy chi nhánh với điều kiện tùy chọn
      const branches = await this.prismaService.branches.findMany({
        where: branch_id ? { id: Number(branch_id) } : undefined,
        select: {
          id: true,
          name: true,
        },
      });

      if (branch_id && branches.length === 0) {
        throw new HttpException(
          'Không tìm thấy chi nhánh',
          HttpStatus.NOT_FOUND,
        );
      }

      // B2: Lấy thời gian của tuần hiện tại
      const now = dayjs();
      const dateRange = {
        gte: now.startOf('week').toDate(),
        lte: now.endOf('week').toDate(),
      };

      // B3: Lấy bookings và tính tổng doanh thu
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          branch_id: {
            in: branches.map((branch) => branch.id),
          },
          created_at: dateRange,
        },
        select: {
          branch_id: true,
          booking_details: {
            select: {
              total_amount: true,
            },
          },
        },
      });

      // B4: Tính toán và định dạng kết quả
      const result = branches.reduce(
        (acc, { id, name }) => {
          const branchBookings = bookings.filter(
            (booking) => booking.branch_id === id,
          );
          const totalRevenue = branchBookings.reduce(
            (sum, booking) =>
              sum +
              booking.booking_details.reduce(
                (detailSum, detail) => detailSum + (detail.total_amount || 0),
                0,
              ),
            0,
          );

          acc[name] = totalRevenue;
          return acc;
        },
        {} as Record<string, number>,
      );

      return branch_id > 0 ? result : this.transformBranchData(result);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForEachBranchByMonth: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Tổng doanh thu của từng chi nhánh theo quý
  async getTotalRevenueForEachBranchByQuarter(branch_id: number) {
    try {
      // B1: Lấy chi nhánh với điều kiện tùy chọn
      const branches = await this.prismaService.branches.findMany({
        where: branch_id ? { id: Number(branch_id) } : undefined,
        select: {
          id: true,
          name: true,
        },
      });

      if (branches.length === 0) {
        return branch_id
          ? new NotFoundException('Không tìm thấy chi nhánh')
          : {};
      }

      // B2: Lấy thời gian của năm hiện tại
      const now = dayjs();
      const dateRange = {
        gte: now.startOf('year').toDate(),
        lte: now.endOf('year').toDate(),
      };
      // B3: Khởi tạo object kết quả
      const result = branches.reduce((acc, { name }) => {
        acc[name] = [0, 0, 0, 0];
        return acc;
      }, {});

      // B4: Lấy và tính toán doanh thu từ bookings
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          branch_id: { in: branches.map((branch) => branch.id) },
          created_at: dateRange,
          status: 'success',
          deleted: false,
        },
        select: {
          branch_id: true,
          created_at: true,
          booking_details: {
            select: { total_amount: true },
          },
        },
      });

      // B5: Map branch_id với tên chi nhánh để tránh tìm kiếm lặp đi lặp lại
      const branchMap = new Map(
        branches.map((branch) => [branch.id, branch.name]),
      );

      // B6: Tính toán doanh thu theo quý
      bookings.forEach((booking) => {
        const branchName = branchMap.get(booking.branch_id);
        if (!branchName) return;

        const totalAmount = booking.booking_details.reduce(
          (sum, detail) => sum + (detail.total_amount || 0),
          0,
        );

        const month = dayjs(booking.created_at).month();
        const quarterIndex = Math.floor(month / 3);

        result[branchName][quarterIndex] += totalAmount;
      });

      return branch_id > 0 ? result : this.transformQuarterlyData(result);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForEachBranchByQuarter: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Tổng doanh thu của từng chi nhánh theo năm
  async getTotalRevenueForEachBranchByYear(branch_id: number) {
    try {
      // B1: Lấy chi nhánh với điều kiện tùy chọn
      const branches = await this.prismaService.branches.findMany({
        where: branch_id ? { id: Number(branch_id) } : undefined,
        select: {
          id: true,
          name: true,
        },
      });

      if (branches.length === 0) {
        return branch_id
          ? new NotFoundException('Không tìm thấy chi nhánh')
          : {};
      }

      // B2: Lấy thời gian của năm hiện tại
      const now = dayjs();
      const dateRange = {
        gte: now.startOf('year').toDate(),
        lte: now.endOf('year').toDate(),
      };

      // B3: Lấy bookings và tính toán
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          branch_id: { in: branches.map((branch) => branch.id) },
          created_at: dateRange,
          deleted: false,
          status: 'success',
        },
        include: {
          booking_details: {
            select: {
              total_amount: true,
            },
          },
        },
      });

      // B4: Tính tổng doanh thu cho từng chi nhánh
      const branchRevenues = bookings.reduce(
        (acc, booking) => {
          const totalAmount = booking.booking_details.reduce(
            (sum, detail) => sum + (detail.total_amount || 0),
            0,
          );
          acc[booking.branch_id] = (acc[booking.branch_id] || 0) + totalAmount;
          return acc;
        },
        {} as Record<number, number>,
      );

      // B5: Tạo kết quả cuối cùng
      const result = branches.reduce((acc, branch) => {
        acc[branch.name] = branchRevenues[branch.id] || 0;
        return acc;
      }, {});

      return branch_id > 0 ? result : this.transformBranchData(result);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForEachBranchByYear: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Tổng doanh thu từng tháng trong năm của từng chi nhánh
  async getTotalRevenueForEachBranchEachMonth(branch_id: number) {
    try {
      // B1: Lấy thời gian của năm hiện tại
      const now = dayjs();
      const dateRange = {
        gte: now.startOf('year').toDate(),
        lte: now.endOf('year').toDate(),
      };

      // B2: Lấy chi nhánh(s)
      const branches = await this.prismaService.branches.findMany({
        where: branch_id ? { id: Number(branch_id) } : undefined,
        select: {
          id: true,
          name: true,
        },
      });

      if (branches.length === 0) {
        throw new NotFoundException('Không tìm thấy chi nhánh');
      }

      // B3: Lấy bookings cho tất cả chi nhánh trong một lần query
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          branch_id: { in: branches.map((branch) => branch.id) },
          created_at: dateRange,
          deleted: false,
          status: 'success',
        },
        select: {
          branch_id: true,
          created_at: true,
          booking_details: {
            select: {
              total_amount: true,
            },
          },
        },
      });

      // B4: Tính toán doanh thu cho từng chi nhánh
      const branchRevenueMap = new Map<number, number[]>();
      const branchTotalMap = new Map<number, number>();

      // Khởi tạo mảng cho từng chi nhánh
      branches.forEach((branch) => {
        branchRevenueMap.set(branch.id, Array(12).fill(0));
        branchTotalMap.set(branch.id, 0);
      });

      // Tính toán doanh thu
      bookings.forEach((booking) => {
        const totalAmount = booking.booking_details.reduce(
          (sum, detail) => sum + (detail.total_amount || 0),
          0,
        );
        const month = dayjs(booking.created_at).month(); // Tháng bắt đầu từ 0 (January)
        const monthlyRevenue = branchRevenueMap.get(booking.branch_id);
        const currentTotal = branchTotalMap.get(booking.branch_id) || 0;

        if (monthlyRevenue) {
          monthlyRevenue[month] += totalAmount;
          branchRevenueMap.set(booking.branch_id, monthlyRevenue);
          branchTotalMap.set(booking.branch_id, currentTotal + totalAmount);
        }
      });

      // B5: Tạo kết quả
      const results = branches.map((branch) => ({
        name: branch.name,
        data: branchRevenueMap.get(branch.id) || Array(12).fill(0),
        total: branchTotalMap.get(branch.id) || 0,
      }));

      // B6: Nếu chỉ định branch_id, trả về một chi nhánh
      if (branch_id) {
        return results[0];
      }

      // B7: Sắp xếp theo tổng doanh thu giảm dần
      const sort = results.sort((a, b) => b.total - a.total);

      return branch_id > 0 ? sort : this.transformDataByYear(sort);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForEachBranchEachMonth: ',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Thống kê tiệc đang pending, success, cancel, processing của từng chi nhánh
  async countBookingStatus(branch_id: number) {
    try {
      // B1: Lấy thông tin chi nhánh
      const branches = await this.prismaService.branches.findMany({
        where: branch_id ? { id: Number(branch_id) } : undefined,
        select: { id: true, name: true },
      });

      if (branches.length === 0) {
        throw new NotFoundException('Không tìm thấy chi nhánh');
      }

      // B2: Lấy tất cả các booking theo trạng thái và chi nhánh trong một lần truy vấn
      const bookingStatusCounts = await this.prismaService.bookings.groupBy({
        by: ['branch_id', 'status'],
        where: {
          branch_id: { in: branches.map((branch) => branch.id) },
        },
        _count: {
          status: true,
        },
      });

      // B3: Khởi tạo dữ liệu ban đầu cho từng chi nhánh với giá trị bằng 0
      const statusCounts = branches.map((branch) => ({
        id: branch.id, // Include branch id for matching later
        name: branch.name,
        data: {
          pending: 0,
          success: 0,
          cancel: 0,
          processing: 0,
        },
      }));

      // B4: Cập nhật dữ liệu thống kê từ kết quả truy vấn
      bookingStatusCounts.forEach((statusCount) => {
        const branchData = statusCounts.find(
          (branch) => branch.id === statusCount.branch_id,
        );
        if (branchData) {
          branchData.data[statusCount.status] = statusCount._count.status;
        }
      });

      // B5: Trả về kết quả sau khi cập nhật dữ liệu
      if (branch_id) {
        return statusCounts;
      } else {
        return this.transformDataStatusWithBranches(statusCounts);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ dashboardService -> countBookingStatus: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  transformBranchData(data) {
    // Create a new object to hold the transformed data
    const result = {};

    // Iterate through each key in the original data
    for (const branch in data) {
      if (branch === 'Hồ Chí Minh') {
        // Set up "Hồ Chí Minh" with value and other branches in nested structure
        result[branch] = {
          value: data[branch],
          branches: { ...data, [branch]: undefined },
        };
      } else {
        // Keep other branches as they are
        result[branch] = data[branch];
      }
    }

    // Remove "Hồ Chí Minh" from nested branches inside the "Hồ Chí Minh" object
    delete result['Hồ Chí Minh'].branches['Hồ Chí Minh'];

    return result;
  }

  transformQuarterlyData(data) {
    // Initialize the result object
    const result = {};

    // Iterate over each branch
    for (const branch in data) {
      if (branch === 'Hồ Chí Minh') {
        // Set up "Hồ Chí Minh" with quarterly values and other branches in a nested structure
        result[branch] = {
          value: data[branch],
          branches: { ...data, [branch]: undefined }, // Copy all data except "Hồ Chí Minh"
        };
      } else {
        // Keep other branches as they are
        result[branch] = data[branch];
      }
    }

    // Remove self-reference to "Hồ Chí Minh" in its own nested branches
    delete result['Hồ Chí Minh'].branches['Hồ Chí Minh'];

    return result;
  }

  transformDataByYear(data) {
    // Separate "Hồ Chí Minh" data and other branches
    const hoChiMinhBranch = data.find(
      (branch) => branch.name === 'Hồ Chí Minh',
    );
    const otherBranches = data.filter(
      (branch) => branch.name !== 'Hồ Chí Minh',
    );

    // Transform data as required
    return {
      ...Object.fromEntries(
        otherBranches.map((branch) => [
          branch.name,
          { data: branch.data, total: branch.total },
        ]),
      ),
      'Hồ Chí Minh': {
        value: hoChiMinhBranch.total,
        branches: Object.fromEntries(
          otherBranches.map((branch) => [
            branch.name,
            { data: branch.data, total: branch.total },
          ]),
        ),
      },
    };
  }

  transformDataStatusWithBranches(data) {
    // Extract "Hồ Chí Minh" entry and other branches
    const hoChiMinhBranch = data.find(
      (branch) => branch.name === 'Hồ Chí Minh',
    );
    const otherBranches = data.filter(
      (branch) => branch.name !== 'Hồ Chí Minh',
    );

    // Format result with "Hồ Chí Minh" including other branches under `branches`
    return {
      ...Object.fromEntries(
        otherBranches.map((branch) => [branch.name, branch.data]),
      ),
      'Hồ Chí Minh': {
        ...hoChiMinhBranch.data,
        branches: Object.fromEntries(
          otherBranches.map((branch) => [branch.name, branch.data]),
        ),
      },
    };
  }
}
