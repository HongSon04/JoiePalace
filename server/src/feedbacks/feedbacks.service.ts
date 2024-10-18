import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from 'src/prisma.service';

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
        throw new HttpException(
          'Không tìm thấy đơn tiệc',
          HttpStatus.NOT_FOUND,
        );
      }
      let user;
      if (user_id) {
        user = await this.prismaService.users.findUnique({
          where: {
            id: Number(user_id),
          },
        });
        if (!user) {
          throw new HttpException('Không tìm thấy user', HttpStatus.NOT_FOUND);
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
          data: feedback,
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ feedbacks.service.ts->create', error);
      throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ! Lấy tất cả feedback đã được duyệt
  async findAllShow() {
    try {
      const feedbacks = await this.prismaService.feedbacks.findMany({
        where: {
          is_show: true,
        },
        include: {
          bookings: true,
          branches: true,
        },
      });
      throw new HttpException(
        {
          message: 'Lấy danh sách feedback thành công',
          data: feedbacks,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ feedbacks.service.ts->findAllShow', error);
      throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ! Lấy tất cả feedback bị ẩn
  async findAllHide() {
    try {
      const feedbacks = await this.prismaService.feedbacks.findMany({
        where: {
          is_show: false,
        },
        include: {
          bookings: true,
          branches: true,
        },
      });
      throw new HttpException(
        {
          message: 'Lấy danh sách feedback thành công',
          data: feedbacks,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ feedbacks.service.ts->findAllHide', error);
      throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ! Lấy tất cả feedback theo id
  async findOne(id: number) {
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
      throw new HttpException('Không tìm thấy feedback', HttpStatus.NOT_FOUND);
    }
    throw new HttpException(
      {
        message: 'Lấy feedback thành công',
        data: feedback,
      },
      HttpStatus.OK,
    );
  }

  // ! Lấy tất cả feedback theo id của booking
  async findByBooking(booking_id: number) {
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
      throw new HttpException('Không tìm thấy feedback', HttpStatus.NOT_FOUND);
    }
    throw new HttpException(
      {
        message: 'Lấy feedback thành công',
        data: feedback,
      },
      HttpStatus.OK,
    );
  }

  // ! Lấy tất cả feedback theo id của branch
  async findByBranch(branch_id: number) {
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
      throw new HttpException('Không tìm thấy feedback', HttpStatus.NOT_FOUND);
    }
    throw new HttpException(
      {
        message: 'Lấy feedback thành công',
        data: feedback,
      },
      HttpStatus.OK,
    );
  }

  // ! Lấy tất cả feedback theo id của user
  async findByUser(user_id: number) {
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
      throw new HttpException('Không tìm thấy feedback', HttpStatus.NOT_FOUND);
    }
    throw new HttpException(
      {
        message: 'Lấy feedback thành công',
        data: feedback,
      },
      HttpStatus.OK,
    );
  }

  // ! Cập nhật feedback
  async update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    const { name, comments, rate, is_show } = updateFeedbackDto;
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
        data: feedback,
      },
      HttpStatus.OK,
    );
  }

  async remove(id: number) {
    const feedback = await this.prismaService.feedbacks.delete({
      where: {
        id: Number(id),
      },
    });
    await this.updateRateBranch(Number(feedback.branch_id));
    throw new HttpException(
      {
        message: 'Xóa feedback thành công',
        data: feedback,
      },
      HttpStatus.OK,
    );
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
