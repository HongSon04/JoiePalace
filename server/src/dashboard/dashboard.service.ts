import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prismaService: PrismaService) {}
  // ! Tổng doanh thu của tất cả các chi nhánh
  async getTotalRevenueForBranch() {
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

  // ! Tổng doanh thu của tất cả các chi nhánh theo tuần
  async getTotalRevenueForBranchByWeek() {
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

  // ! Tổng doanh thu của tất cả các chi nhánh theo tháng
  async getTotalRevenueForBranchByMonth() {
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

  // ! Tổng doanh thu của tất cả các chi nhánh theo năm
  async getTotalRevenueForBranchByYear() {
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
}
