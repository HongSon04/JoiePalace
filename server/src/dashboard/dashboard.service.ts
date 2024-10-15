import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prismaService: PrismaService) {}
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
      let total = 0;
      for (let booking of bookings) {
        total += booking.booking_details.reduce(
          (acc, cur) => acc + cur.total_amount,
          0,
        );
      }
      return total;
    } catch (error) {}
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
      let total = 0;
      for (let booking of bookings) {
        total += booking.booking_details.reduce(
          (acc, cur) => acc + cur.total_amount,
          0,
        );
      }
      return total;
    } catch (error) {}
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
      let total = 0;
      for (let booking of bookings) {
        total += booking.booking_details.reduce(
          (acc, cur) => acc + cur.total_amount,
          0,
        );
      }
      return total;
    } catch (error) {}
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
      let total = 0;
      for (let booking of bookings) {
        total += booking.booking_details.reduce(
          (acc, cur) => acc + cur.total_amount,
          0,
        );
      }
      return total;
    } catch (error) {}
  }

  // ! Tổng doanh thu từng tháng trong năm của tất cả các chi nhánh
  async getTotalRevenueForAllBranchEachMonth() {
    try {
      // VD dữ liệu trả về: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200]
      let data = Array(12).fill(0);
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
      for (let booking of bookings) {
        const month = dayjs(booking.created_at).month();
        data[month] += booking.booking_details.reduce(
          (acc, cur) => acc + cur.total_amount,
          0,
        );
      }
      return data;
    } catch (error) {}
  }

  // ! Thống kê tiệc đang pending, success, cancel, processing của tất cả các chi nhánh
  async countBookingStatusForAllBranch() {
    try {
      // VD dữ liệu trả về: {"pending": 100, "success": 200, "cancel": 300, "processing": 400}
      let data = {
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
      for (let booking of bookings) {
        if (booking.status === 'pending') {
          data.pending++;
        } else if (booking.status === 'success') {
          data.success++;
        } else if (booking.status === 'cancel') {
          data.cancel++;
        } else if (booking.status === 'processing') {
          data.processing++;
        }
      }
      return data;
    } catch (error) {}
  }

  // ! Tổng doanh thu của từng chi nhánh
  async getTotalRevenueForEachBranch() {
    try {
      const data = {};
      // B1: Lấy tất cả các chi nhánh
      const branches = await this.prismaService.branches.findMany();
      // B2: Lấy tất cả các booking
      for (let branch of branches) {
        const bookings = await this.prismaService.bookings.findMany({
          where: {
            branch_id: branch.id,
          },
          include: {
            booking_details: {
              select: {
                total_amount: true,
              },
            },
          },
        });
        // B3: Tính tổng doanh thu của từng chi nhánh
        if (!bookings || bookings.length === 0) {
          data[branch.name] = 0;
        } else {
          for (let booking of bookings) {
            const total_price = booking.booking_details.reduce(
              (acc, cur) => acc + cur.total_amount,
              0,
            );
            if (data[branch.id]) {
              data[branch.name] += total_price;
            } else {
              data[branch.name] = total_price;
            }
          }
        }
      }
      return data;
    } catch (error) {}
  }

  // ! Tổng doanh thu của từng chi nhánh theo tuần
  async getTotalRevenueForEachBranchByWeek() {
    try {
      const data = {};
      // B1: Lấy tất cả các chi nhánh
      const branches = await this.prismaService.branches.findMany();
      // B2: Lấy ngày bắt đầu và kết thúc của tuần
      const now = new Date();
      const startOfWeek = dayjs(now).startOf('week').toDate();
      const endOfWeek = dayjs(now).endOf('week').toDate();
      // B3: Lấy tất cả các booking
      for (let branch of branches) {
        const bookings = await this.prismaService.bookings.findMany({
          where: {
            branch_id: branch.id,
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
        // B3: Tính tổng doanh thu của từng chi nhánh
        if (!bookings || bookings.length === 0) {
          data[branch.name] = 0;
        } else {
          for (let booking of bookings) {
            const total_price = booking.booking_details.reduce(
              (acc, cur) => acc + cur.total_amount,
              0,
            );
            if (data[branch.id]) {
              data[branch.name] += total_price;
            } else {
              data[branch.name] = total_price;
            }
          }
        }
      }
      return data;
    } catch (error) {}
  }

  // ! Tổng doanh thu của từng chi nhánh theo tháng
  async getTotalRevenueForEachBranchByMonth() {
    try {
      const data = {};
      // B1: Lấy tất cả các chi nhánh
      const branches = await this.prismaService.branches.findMany();
      // B2: Lấy ngày bắt đầu và kết thúc của tháng
      const now = new Date();
      const startOfMonth = dayjs(now).startOf('month').toDate();
      const endOfMonth = dayjs(now).endOf('month').toDate();
      console.log(startOfMonth, endOfMonth);
      // B3: Lấy tất cả các booking
      for (let branch of branches) {
        const bookings = await this.prismaService.bookings.findMany({
          where: {
            branch_id: branch.id,
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
        // B3: Tính tổng doanh thu của từng chi nhánh
        if (!bookings || bookings.length === 0) {
          data[branch.name] = 0;
        } else {
          for (let booking of bookings) {
            const total_price = booking.booking_details.reduce(
              (acc, cur) => acc + cur.total_amount,
              0,
            );
            if (data[branch.id]) {
              data[branch.name] += total_price;
            } else {
              data[branch.name] = total_price;
            }
          }
        }
      }
      return data;
    } catch (error) {}
  }

  // ! Tổng doanh thu của từng chi nhánh theo năm
  async getTotalRevenueForEachBranchByYear() {
    try {
      const data = {};
      // B1: Lấy tất cả các chi nhánh
      const branches = await this.prismaService.branches.findMany();
      // B2: Lấy ngày bắt đầu và kết thúc của năm
      const now = new Date();
      const startOfYear = dayjs(now).startOf('year').toDate();
      const endOfYear = dayjs(now).endOf('year').toDate();
      // B3: Lấy tất cả các booking
      for (let branch of branches) {
        const bookings = await this.prismaService.bookings.findMany({
          where: {
            branch_id: branch.id,
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
        // B3: Tính tổng doanh thu của từng chi nhánh
        if (!bookings || bookings.length === 0) {
          data[branch.name] = 0;
        } else {
          for (let booking of bookings) {
            const total_price = booking.booking_details.reduce(
              (acc, cur) => acc + cur.total_amount,
              0,
            );
            if (data[branch.id]) {
              data[branch.name] += total_price;
            } else {
              data[branch.name] = total_price;
            }
          }
        }
      }
      return data;
    } catch (error) {}
  }

  // ! Tổng doanh thu từng tháng trong năm của từng chi nhánh
  async getTotalRevenueForEachBranchEachMonth() {
    try {
      // VD dữ liệu trả về: [{"name": "Chi nhánh A", "data": [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200], "total": 7200}]
      let data = [];
      // B1: Lấy tất cả các chi nhánh
      const branches = await this.prismaService.branches.findMany();
      // B2: Lấy ngày bắt đầu và kết thúc của năm
      const now = new Date();
      const startOfYear = dayjs(now).startOf('year').toDate();
      const endOfYear = dayjs(now).endOf('year').toDate();
      // B3: Lấy tất cả các booking
      for (let branch of branches) {
        const bookings = await this.prismaService.bookings.findMany({
          where: {
            branch_id: branch.id,
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
        // B3: Tính tổng doanh thu của từng chi nhánh
        if (!bookings || bookings.length === 0) {
          data.push({
            name: branch.name,
            data: Array(12).fill(0),
            total: 0,
          });
        } else {
          const totalRevenueEachMonth = Array(12).fill(0);
          let total = 0;
          for (let booking of bookings) {
            const total_price = booking.booking_details.reduce(
              (acc, cur) => acc + cur.total_amount,
              0,
            );
            const month = dayjs(booking.created_at).month();
            totalRevenueEachMonth[month] += total_price;
            total += total_price;
          }
          data.push({
            name: branch.name,
            data: totalRevenueEachMonth,
            total: total,
          });
        }
      }
      // B4: Sắp xếp theo tổng doanh thu giảm dần
      data.sort((a, b) => b.total - a.total);
      return data;
    } catch (error) {}
  }

  // ! Thống kê tiệc đang pending, success, cancel, processing của từng chi nhánh
  async countBookingStatus() {
    try {
      // VD dữ liệu trả về: [{"name": "Chi nhánh A", "data": [10, 20, 30, 40]}]
      let data = [];
      // B1: Lấy tất cả các chi nhánh
      const branches = await this.prismaService.branches.findMany();
      // B2: Lấy tất cả các booking
      let total_pending = 0;
      let total_success = 0;
      let total_cancel = 0;
      let total_processing = 0;
      for (let branch of branches) {
        const bookings = await this.prismaService.bookings.findMany({
          where: {
            branch_id: branch.id,
          },
          select: {
            status: true,
          },
        });
        // B3: Tính tổng số tiệc theo từng trạng thái
        let pending = 0;
        let success = 0;
        let cancel = 0;
        let processing = 0;
        for (let booking of bookings) {
          if (booking.status === 'pending') {
            pending++;
            total_pending++;
          } else if (booking.status === 'success') {
            success++;
            total_success++;
          } else if (booking.status === 'cancel') {
            cancel++;
            total_cancel++;
          } else if (booking.status === 'processing') {
            processing++;
            total_processing++;
          }
        }
        data.push({
          name: branch.name,
          data: {
            pending: pending,
            success: success,
            cancel: cancel,
            processing: processing,
          },
        });
      }
      return data;
    } catch (error) {}
  }
}
