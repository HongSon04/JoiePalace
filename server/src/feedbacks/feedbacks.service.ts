import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FormatReturnData } from 'helper/FormatReturnData';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';
import { PrismaService } from 'src/prisma.service';
import { FilterFeedBackDto } from './dto/FilterFeedBackDto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(private prismaService: PrismaService) {}

  // ! Tạo Feedback
  async create(createFeedbackDto: CreateFeedbackDto) {
    try {
      const { name, booking_id, branch_id, comments, rate, user_id } =
        createFeedbackDto;

      const [booking, user] = await this.prismaService.$transaction([
        this.prismaService.bookings.findUnique({
          where: {
            id: Number(booking_id),
          },
        }),
        user_id !== undefined
          ? this.prismaService.users.findUnique({
              where: {
                id: Number(user_id),
              },
            })
          : null,
      ]);

      if (!booking) {
        throw new NotFoundException('Không tìm thấy đơn tiệc');
      }

      if (user_id && !user) {
        throw new NotFoundException('Không tìm thấy user');
      }

      const feedback = await this.prismaService.feedbacks.create({
        data: {
          name,
          booking_id: Number(booking_id),
          branch_id: Number(branch_id),
          comments,
          rate: Number(rate),
          user_id: user_id ? Number(user_id) : null,
        },
      });

      await this.updateRateBranch(Number(branch_id));

      throw new HttpException(
        {
          message: 'Tạo feedback thành công',
          data: FormatReturnData(feedback, []),
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ feedbacks.service.ts->create', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Lấy tất cả feedback
  async findAllShow(query: FilterFeedBackDto) {
    try {
      const {
        page = 1,
        itemsPerPage = 10,
        search = '',
        startDate,
        endDate,
        is_show,
        is_approved,
        branch_id,
        user_id,
        booking_id,
      } = query;
      const skip = (Number(page) - 1) * Number(itemsPerPage);

      const sortRangeDate: any =
        startDate && endDate
          ? {
              created_at: {
                gte: new Date(FormatDateToStartOfDay(startDate)),
                lte: new Date(FormatDateToEndOfDay(endDate)),
              },
            }
          : {};

      const whereConditions: any = {
        ...sortRangeDate,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { comments: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(is_show !== undefined && { is_show: String(is_show) === 'true' }),
        ...(is_approved !== undefined && {
          is_approved: String(is_approved) === 'true',
        }),
        ...(branch_id !== undefined && { branch_id: Number(branch_id) }),
        ...(user_id !== undefined && { user_id: Number(user_id) }),
        ...(booking_id !== undefined && { booking_id: Number(booking_id) }),
      };

      const [feedbacks, total] = await this.prismaService.$transaction([
        this.prismaService.feedbacks.findMany({
          where: whereConditions,
          include: { bookings: true, branches: true },
          skip: Number(skip),
          take: Number(itemsPerPage),
          orderBy: { created_at: 'desc' },
        }),
        this.prismaService.feedbacks.count({ where: whereConditions }),
      ]);

      const lastPage = Math.ceil(Number(total) / Number(itemsPerPage));
      const paginationInfo = {
        lastPage,
        nextPage: Number(page) < lastPage ? Number(page) + 1 : null,
        prevPage: Number(page) > 1 ? Number(page) - 1 : null,
        currentPage: Number(page),
        itemsPerPage: Number(itemsPerPage),
        total: Number(total),
      };

      throw new HttpException(
        { data: FormatReturnData(feedbacks, []), pagination: paginationInfo },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ feedbacks.service.ts->findAllShow', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Cập nhật feedback
  async update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    try {
      const { name, comments, rate, is_show, is_approved, user_id } =
        updateFeedbackDto;

      const feedback = await this.prismaService.$transaction(async (tx) => {
        const existingFeedback = await tx.feedbacks.findUnique({
          where: {
            id: Number(id),
          },
        });

        if (!existingFeedback) {
          throw new NotFoundException('Không tìm thấy feedback');
        }

        if (user_id !== undefined) {
          const user = await tx.users.findUnique({
            where: {
              id: Number(user_id),
            },
          });

          if (!user) {
            throw new NotFoundException('Không tìm thấy user');
          }
        }
        const updatedFeedback = await tx.feedbacks.update({
          where: {
            id: Number(id),
          },
          data: {
            name,
            comments,
            rate: Number(rate),
            is_show,
            user_id: user_id
              ? Number(user_id)
              : Number(existingFeedback.user_id),
            is_approved,
          },
        });

        await this.updateRateBranch(Number(existingFeedback.branch_id));

        return updatedFeedback;
      });

      throw new HttpException(
        {
          message: 'Cập nhật feedback thành công',
          data: FormatReturnData(feedback, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ feedbacks.service.ts->update', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Xóa feedback
  async remove(id: number) {
    try {
      await this.prismaService.$transaction(async (tx) => {
        const existingFeedback = await tx.feedbacks.findUnique({
          where: {
            id: Number(id),
          },
        });

        if (!existingFeedback) {
          throw new NotFoundException('Không tìm thấy feedback');
        }

        await this.updateRateBranch(Number(existingFeedback.branch_id));

        return await tx.feedbacks.delete({
          where: {
            id: Number(id),
          },
        });
      });

      throw new HttpException(
        {
          message: 'Xóa feedback thành công',
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ feedbacks.service.ts->remove', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ? Update lại rate của branch sau khi có feedback mới
  async updateRateBranch(branch_id: number) {
    const [feedbacks, branchRate] = await this.prismaService.$transaction([
      this.prismaService.feedbacks.findMany({
        where: {
          branch_id: Number(branch_id),
        },
        select: {
          rate: true,
        },
      }),
      this.prismaService.branches.findUnique({
        where: {
          id: Number(branch_id),
        },
        select: {
          rate: true,
        },
      }),
    ]);

    const totalRate = feedbacks.reduce(
      (sum, feedback) => sum + feedback.rate,
      0,
    );
    const newRate = parseFloat((totalRate / feedbacks.length).toFixed(1));

    if (newRate !== branchRate.rate) {
      await this.prismaService.branches.update({
        where: {
          id: Number(branch_id),
        },
        data: {
          rate: newRate,
        },
      });
    }
  }
}
