import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from 'src/prisma.service';
import { FormatReturnData } from 'helper/FormatReturnData';
import { FilterDto } from 'helper/dto/Filter.dto';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';

@Injectable()
export class FeedbacksService {
  constructor(private prismaService: PrismaService) {}

  // ! Tạo Feedback
  async create(createFeedbackDto: CreateFeedbackDto) {
    try {
      const { name, booking_id, branch_id, comments, rate, user_id } =
        createFeedbackDto;

      const findBooking = await this.prismaService.bookings.findUnique({
        where: {
          id: Number(booking_id),
        },
      });
      if (!findBooking) {
        throw new NotFoundException('Không tìm thấy đơn tiệc');
      }
      let user;
      if (user_id) {
        user = await this.prismaService.users.findUnique({
          where: {
            id: Number(user_id),
          },
        });
        if (!user) {
          throw new NotFoundException('Không tìm thấy user');
        }
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Lấy tất cả feedback đã được duyệt
  async findAllShow(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : '';
      const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : '';

      const sortRangeDate: any =
        startDate && endDate
          ? {
              created_at: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {};

      const whereConditions: any = {
        is_show: true,
        ...sortRangeDate,
      };

      if (search) {
        whereConditions.OR = [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            comments: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }
      const [feedbacks, total] = await this.prismaService.$transaction([
        this.prismaService.feedbacks.findMany({
          where: whereConditions,
          include: {
            bookings: true,
            branches: true,
          },
          skip,
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.feedbacks.count({
          where: whereConditions,
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        lastPage,
        nextPage: page < lastPage ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        currentPage: page,
        itemsPerPage,
        total,
      };

      throw new HttpException(
        {
          data: FormatReturnData(feedbacks, []),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ feedbacks.service.ts->findAllShow', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Lấy tất cả feedback bị ẩn
  async findAllHide(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : '';
      const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : '';

      const sortRangeDate: any =
        startDate && endDate
          ? {
              created_at: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {};

      const whereConditions: any = {
        is_show: false,
        ...sortRangeDate,
      };

      if (search) {
        whereConditions.OR = [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            comments: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }
      const [feedbacks, total] = await this.prismaService.$transaction([
        this.prismaService.feedbacks.findMany({
          where: whereConditions,
          include: {
            bookings: true,
            branches: true,
          },
          skip,
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.feedbacks.count({
          where: whereConditions,
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        lastPage,
        nextPage: page < lastPage ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        currentPage: page,
        itemsPerPage,
        total,
      };

      throw new HttpException(
        {
          data: FormatReturnData(feedbacks, []),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ feedbacks.service.ts->findAllShow', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Lấy tất cả feedback theo id
  async findOne(id: number) {
    try {
      const feedback = await this.prismaService.feedbacks.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          bookings: true,
          branches: true,
        },
      });
      if (!feedback) {
        throw new NotFoundException('Không tìm thấy feedback');
      }
      throw new HttpException(
        {
          message: 'Lấy feedback thành công',
          data: FormatReturnData(feedback, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ feedbacks.service.ts->findOne', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Lấy tất cả feedback theo id của booking
  async findByBooking(booking_id: number) {
    try {
      const feedback = await this.prismaService.feedbacks.findMany({
        where: {
          booking_id: Number(booking_id),
        },
        include: {
          bookings: true,
          branches: true,
        },
      });
      if (!feedback) {
        throw new NotFoundException('Không tìm thấy feedback');
      }
      throw new HttpException(
        {
          message: 'Lấy feedback thành công',
          data: FormatReturnData(feedback, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ feedbacks.service.ts->findByBooking', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Lấy tất cả feedback theo id của branch
  async findByBranch(branch_id: number) {
    try {
      const feedback = await this.prismaService.feedbacks.findMany({
        where: {
          branch_id: Number(branch_id),
        },
        include: {
          bookings: true,
          branches: true,
        },
      });
      if (!feedback) {
        throw new NotFoundException('Không tìm thấy feedback');
      }
      throw new HttpException(
        {
          message: 'Lấy feedback thành công',
          data: FormatReturnData(feedback, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ feedbacks.service.ts->findByBranch', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Lấy tất cả feedback theo id của user
  async findByUser(user_id: number) {
    try {
      const feedback = await this.prismaService.feedbacks.findMany({
        where: {
          user_id: Number(user_id),
        },
        include: {
          bookings: true,
          branches: true,
        },
      });
      if (!feedback) {
        throw new NotFoundException('Không tìm thấy feedback');
      }
      throw new HttpException(
        {
          message: 'Lấy feedback thành công',
          data: FormatReturnData(feedback, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ feedbacks.service.ts->findByUser', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Cập nhật feedback
  async update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    try {
      const { name, comments, rate, is_show } = updateFeedbackDto;

      const findFeedback = await this.prismaService.feedbacks.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!findFeedback) {
        throw new NotFoundException('Không tìm thấy feedback');
      }
      const feedback = await this.prismaService.feedbacks.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          comments,
          rate: Number(rate),
          is_show,
        },
      });
      await this.updateRateBranch(Number(feedback.branch_id));
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Xóa feedback
  async remove(id: number) {
    try {
      const feedback = await this.prismaService.feedbacks.delete({
        where: {
          id: Number(id),
        },
      });
      await this.updateRateBranch(Number(feedback.branch_id));
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ? Update lại rate của branch sau khi có feedback mới
  async updateRateBranch(branch_id: number) {
    const findAllFeedback = await this.prismaService.feedbacks.findMany({
      where: {
        branch_id: Number(branch_id),
      },
    });

    const totalRate = findAllFeedback.reduce(
      (sum, feedback) => sum + feedback.rate,
      0,
    );
    const rateBranch = (totalRate / findAllFeedback.length).toFixed(1);

    await this.prismaService.branches.update({
      where: {
        id: Number(branch_id),
      },
      data: {
        rate: parseFloat(rateBranch),
      },
    });
    return;
  }
}
