import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prismaService: PrismaService) {}

  // ! Lấy tất cả thông tin của dashboard (tất cả các chi nhánh)
  async getAllInfo() {
    try {
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Tổng doanh thu của tất cả các chi nhánh
  async getTotalRevenueForAllBranch() {
    try {
      // B1: Lấy tất cả các booking
      const bookings = await this.prismaService.bookings.findMany({
        include: {
          booking_details: {
            select: {
              total_amount: true,
            },
          },
        },
      });

      // B2: Tính tổng doanh thu
      const total = bookings.reduce((acc, booking) => {
        return (
          acc +
          booking.booking_details.reduce(
            (innerAcc, detail) => innerAcc + detail.total_amount,
            0,
          )
        );
      }, 0);

      return total;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForAllBranch: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo tuần
  async getTotalRevenueForAllBranchByWeek() {
    try {
      // B1: Lấy ngày bắt đầu và kết thúc của tuần
      const now = new Date();
      const startOfWeek = dayjs(now).startOf('week').toDate();
      const endOfWeek = dayjs(now).endOf('week').toDate();

      // B2: Lấy tất cả các booking
      const bookings = await this.prismaService.bookings.findMany({
        where: {
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

      // B3: Tính tổng doanh thu
      const total = bookings.reduce((acc, booking) => {
        return (
          acc +
          booking.booking_details.reduce(
            (innerAcc, detail) => innerAcc + detail.total_amount,
            0,
          )
        );
      }, 0);

      return total;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForAllBranchByWeek: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo tháng
  async getTotalRevenueForAllBranchByMonth() {
    try {
      // B1: Lấy ngày bắt đầu và kết thúc của tháng
      const now = new Date();
      const startOfMonth = dayjs(now).startOf('month').toDate();
      const endOfMonth = dayjs(now).endOf('month').toDate();

      // B2: Lấy tất cả các booking
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          created_at: {
            gte: startOfMonth,
            lte: endOfMonth,
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

      // B3: Tính tổng doanh thu
      const total = bookings.reduce((acc, booking) => {
        return (
          acc +
          booking.booking_details.reduce(
            (innerAcc, detail) => innerAcc + detail.total_amount,
            0,
          )
        );
      }, 0);

      return total;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForAllBranchByMonth: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo quý
  async getTotalRevenueForAllBranchByQuarter() {
    try {
      // B1: Lấy ngày bắt đầu và kết thúc của năm
      const now = new Date();
      const startOfYear = dayjs(now).startOf('year').toDate();
      const endOfYear = dayjs(now).endOf('year').toDate();

      // B2: Lấy tất cả các booking
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          created_at: {
            gte: startOfYear,
            lte: endOfYear,
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

      const quarterlyRevenue = [0, 0, 0, 0];

      // B4: Tính doanh thu cho từng booking
      bookings.forEach((booking) => {
        const bookingTotal = booking.booking_details.reduce(
          (innerAcc, detail) => innerAcc + detail.total_amount,
          0,
        );

        // Xác định quý của booking
        const bookingDate = new Date(booking.created_at);
        const month = bookingDate.getMonth(); // 0 - 11

        if (month >= 0 && month <= 2) {
          quarterlyRevenue[0] += bookingTotal; // Q1
        } else if (month >= 3 && month <= 5) {
          quarterlyRevenue[1] += bookingTotal; // Q2
        } else if (month >= 6 && month <= 8) {
          quarterlyRevenue[2] += bookingTotal; // Q3
        } else if (month >= 9 && month <= 11) {
          quarterlyRevenue[3] += bookingTotal; // Q4
        }
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Tổng doanh thu của tất cả các chi nhánh theo năm
  async getTotalRevenueForAllBranchByYear() {
    try {
      // B1: Lấy ngày bắt đầu và kết thúc của năm
      const now = new Date();
      const startOfYear = dayjs(now).startOf('year').toDate();
      const endOfYear = dayjs(now).endOf('year').toDate();

      // B2: Lấy tất cả các booking
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          created_at: {
            gte: startOfYear,
            lte: endOfYear,
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

      // B3: Tính tổng doanh thu
      const total = bookings.reduce((acc, booking) => {
        return (
          acc +
          booking.booking_details.reduce(
            (innerAcc, detail) => innerAcc + detail.total_amount,
            0,
          )
        );
      }, 0);

      return total;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForAllBranchByYear: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Tổng doanh thu từng tháng trong năm của tất cả các chi nhánh
  async getTotalRevenueForAllBranchEachMonth() {
    try {
      const data = Array(12).fill(0);

      // B1: Lấy tất cả các booking
      const bookings = await this.prismaService.bookings.findMany({
        include: {
          booking_details: {
            select: {
              total_amount: true,
            },
          },
        },
      });

      // B2: Tính tổng doanh thu từng tháng
      bookings.forEach((booking) => {
        const month = dayjs(booking.created_at).month();
        const totalAmount = booking.booking_details.reduce(
          (acc, cur) => acc + cur.total_amount,
          0,
        );
        data[month] += totalAmount;
      });

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForAllBranchEachMonth: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Thống kê tiệc đang pending, success, cancel, processing của tất cả các chi nhánh
  async countBookingStatusForAllBranch() {
    try {
      const data = {
        pending: 0,
        success: 0,
        cancel: 0,
        processing: 0,
      };

      // B1: Lấy tất cả các booking
      const bookings = await this.prismaService.bookings.findMany({
        select: {
          status: true,
        },
      });

      // B2: Tính tổng số tiệc theo từng trạng thái
      bookings.forEach((booking) => {
        if (data.hasOwnProperty(booking.status)) {
          data[booking.status]++;
        }
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Tổng doanh thu của từng chi nhánh
  async getTotalRevenueForEachBranch(branch_id: number) {
    try {
      const data = {};
      let branches;

      if (!branch_id) {
        // B1: Lấy tất cả các chi nhánh
        branches = await this.prismaService.branches.findMany();
      } else {
        // B1: Tìm chi nhánh theo id
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

      // B2: Lấy tất cả các booking cho từng chi nhánh đồng thời
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          branch_id: {
            in: branches.map((branch) => Number(branch.id)),
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

      // B3: Tính tổng doanh thu cho từng chi nhánh
      const revenueMap = {};
      bookings.forEach((booking) => {
        const total_price = booking.booking_details.reduce(
          (innerAcc, cur) => innerAcc + cur.total_amount,
          0,
        );
        revenueMap[booking.branch_id] =
          (revenueMap[booking.branch_id] || 0) + total_price;
      });

      // Gán doanh thu cho từng chi nhánh
      branches.forEach((branch) => {
        data[branch.name] = revenueMap[branch.id] || 0; // Nếu không có booking, gán 0
      });

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForEachBranch: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
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
          (revenueMap[booking.branch_id] || 0) + total_price;
      });

      // Gán doanh thu cho từng chi nhánh
      branches.forEach((branch) => {
        data[branch.name] = revenueMap[branch.id] || 0; // Nếu không có booking, gán 0
      });

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForEachBranchByWeek: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Tổng doanh thu của từng chi nhánh theo tháng
  async getTotalRevenueForEachBranchByMonth(branch_id: number) {
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

      // B2: Lấy ngày bắt đầu và kết thúc của tháng
      const now = new Date();
      const startOfMonth = dayjs(now).startOf('month').toDate();
      const endOfMonth = dayjs(now).endOf('month').toDate();

      // B3: Lấy tất cả các booking cho từng chi nhánh trong một truy vấn
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          branch_id: {
            in: branches.map((branch) => Number(branch.id)),
          },
          created_at: {
            gte: startOfMonth,
            lte: endOfMonth,
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
          (revenueMap[booking.branch_id] || 0) + total_price;
      });

      // Gán doanh thu cho từng chi nhánh
      branches.forEach((branch) => {
        data[branch.name] = revenueMap[branch.id] || 0; // Nếu không có booking, gán 0
      });

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForEachBranchByMonth: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Tổng doanh thu của từng chi nhánh theo quý
  async getTotalRevenueForEachBranchByQuarter(branch_id: number) {
    try {
      const data = {};
      let branches;

      // B1: Lấy tất cả các chi nhánh hoặc chi nhánh cụ thể
      if (!branch_id) {
        branches = await this.prismaService.branches.findMany();

        // Nếu không có chi nhánh nào, trả về mảng rỗng
        if (branches.length === 0) {
          return [];
        }
      } else {
        const branch = await this.prismaService.branches.findUnique({
          where: {
            id: Number(branch_id),
          },
        });
        if (!branch || !branch.id) {
          throw new NotFoundException('Không tìm thấy chi nhánh');
        }
        branches = [branch];
      }

      // Khởi tạo đối tượng doanh thu cho từng chi nhánh
      branches.forEach((branch) => {
        data[branch.name] = [0, 0, 0, 0];
      });

      // B2: Lấy ngày bắt đầu và kết thúc của năm
      const now = new Date();
      const startOfYear = dayjs(now).startOf('year').toDate();
      const endOfYear = dayjs(now).endOf('year').toDate();

      // B3: Lấy tất cả các booking cho từng chi nhánh trong một truy vấn
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          branch_id: {
            in: branches.map((branch) => Number(branch.id)),
          },
          created_at: {
            gte: startOfYear,
            lte: endOfYear,
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
      // B4: Tính doanh thu cho từng booking
      bookings.forEach((booking) => {
        const bookingTotal = booking.booking_details.reduce(
          (innerAcc, detail) => innerAcc + detail.total_amount,
          0,
        );

        // Xác định quý của booking
        const bookingDate = new Date(booking.created_at);
        const month = bookingDate.getMonth(); // 0 - 11

        // Cập nhật doanh thu cho từng chi nhánh theo quý
        const branchName = branches.find(
          (branch) => branch.id === booking.branch_id,
        )?.name; // Lấy tên chi nhánh từ id
        if (branchName) {
          if (month >= 0 && month <= 2) {
            data[branchName][0] += bookingTotal; // Q1
          } else if (month >= 3 && month <= 5) {
            data[branchName][1] += bookingTotal; // Q2
          } else if (month >= 6 && month <= 8) {
            data[branchName][2] += bookingTotal; // Q3
          } else if (month >= 9 && month <= 11) {
            data[branchName][3] += bookingTotal; // Q4
          }
        }
      });

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForEachBranchByQuarter: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Tổng doanh thu của từng chi nhánh theo năm
  async getTotalRevenueForEachBranchByYear(branch_id: number) {
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

      // B2: Lấy ngày bắt đầu và kết thúc của năm
      const now = new Date();
      const startOfYear = dayjs(now).startOf('year').toDate();
      const endOfYear = dayjs(now).endOf('year').toDate();

      // B3: Lấy tất cả các booking cho từng chi nhánh trong một truy vấn
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          branch_id: {
            in: branches.map((branch) => Number(branch.id)),
          },
          created_at: {
            gte: startOfYear,
            lte: endOfYear,
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
          (revenueMap[booking.branch_id] || 0) + total_price;
      });

      // Gán doanh thu cho từng chi nhánh
      branches.forEach((branch) => {
        data[branch.name] = revenueMap[branch.id] || 0; // Nếu không có booking, gán 0
      });

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForEachBranchByYear: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Tổng doanh thu từng tháng trong năm của từng chi nhánh
  async getTotalRevenueForEachBranchEachMonth(branch_id: number) {
    try {
      const data = [];

      if (!branch_id) {
        // B1: Lấy tất cả các chi nhánh
        const branches = await this.prismaService.branches.findMany();
        // B2: Lấy ngày bắt đầu và kết thúc của năm
        const now = new Date();
        const startOfYear = dayjs(now).startOf('year').toDate();
        const endOfYear = dayjs(now).endOf('year').toDate();

        // B3: Lấy tất cả các booking cho từng chi nhánh đồng thời
        const bookingPromises = branches.map(async (branch) => {
          const bookings = await this.prismaService.bookings.findMany({
            where: {
              branch_id: Number(branch.id),
              created_at: {
                gte: startOfYear,
                lte: endOfYear,
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

          // Tính tổng doanh thu của từng chi nhánh
          const totalRevenueEachMonth = Array(12).fill(0);
          let total = 0;

          if (bookings.length === 0) {
            return {
              name: branch.name,
              data: totalRevenueEachMonth,
              total: 0,
            };
          }

          for (let booking of bookings) {
            const total_price = booking.booking_details.reduce(
              (acc, cur) => acc + cur.total_amount,
              0,
            );
            const month = dayjs(booking.created_at).month();
            totalRevenueEachMonth[month] += total_price;
            total += total_price;
          }

          return {
            name: branch.name,
            data: totalRevenueEachMonth,
            total: total,
          };
        });

        // Chờ tất cả các truy vấn hoàn thành
        const results = await Promise.all(bookingPromises);

        // B4: Sắp xếp theo tổng doanh thu giảm dần
        results.sort((a, b) => b.total - a.total);
        return results;
      } else {
        // B1: Lấy chi nhánh theo id
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

        // B2: Lấy ngày bắt đầu và kết thúc của năm
        const now = new Date();
        const startOfYear = dayjs(now).startOf('year').toDate();
        const endOfYear = dayjs(now).endOf('year').toDate();

        // B3: Lấy tất cả các booking cho chi nhánh đó
        const bookings = await this.prismaService.bookings.findMany({
          where: {
            branch_id: Number(branch_id),
            created_at: {
              gte: startOfYear,
              lte: endOfYear,
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

        // Tính tổng doanh thu của chi nhánh đó
        const totalRevenueEachMonth = Array(12).fill(0);
        let total = 0;

        if (bookings.length === 0) {
          throw new HttpException(
            { data: totalRevenueEachMonth },
            HttpStatus.CREATED,
          );
        }

        for (let booking of bookings) {
          const total_price = booking.booking_details.reduce(
            (acc, cur) => acc + cur.total_amount,
            0,
          );
          const month = dayjs(booking.created_at).month();
          totalRevenueEachMonth[month] += total_price;
          total += total_price;
        }
        return {
          name: branch.name,
          data: totalRevenueEachMonth,
          total: total,
        };
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ dashboardService -> getTotalRevenueForEachBranchEachMonth: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Thống kê tiệc đang pending, success, cancel, processing của từng chi nhánh
  async countBookingStatus(branch_id: number) {
    try {
      console.log(branch_id);
      // B1: Lấy tất cả các chi nhánh hoặc chi nhánh cụ thể
      let branches;
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

      // B2: Lấy tất cả các booking cho từng chi nhánh trong một truy vấn
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          branch_id: {
            in: branches.map((branch) => Number(branch.id)),
          },
        },
        select: {
          branch_id: true,
          status: true,
        },
      });

      // B3: Tính tổng số tiệc theo từng trạng thái
      const statusCounts = branches.map((branch) => {
        const branchBookings = bookings.filter(
          (booking) => booking.branch_id === branch.id,
        );
        const counts = branchBookings.reduce(
          (acc, booking) => {
            acc[booking.status] = (acc[booking.status] || 0) + 1;
            return acc;
          },
          { pending: 0, success: 0, cancel: 0, processing: 0 },
        );

        return {
          name: branch.name,
          data: counts,
        };
      });

      return statusCounts;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ dashboardService -> countBookingStatus: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }
}
