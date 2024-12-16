import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FilterDto } from 'helper/dto/Filter.dto';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';
import { FormatReturnData } from 'helper/FormatReturnData';
import { PrismaService } from 'src/prisma.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';

@Injectable()
export class SubscribersService {
  constructor(private prismaService: PrismaService) {}

  // ! Register a new subscriber
  async create(createSubscriberDto: CreateSubscriberDto) {
    try {
      const { email } = createSubscriberDto;
      const findSubscriber = await this.prismaService.subscribers.findUnique({
        where: {
          email,
        },
      });

      if (findSubscriber) {
        throw new BadRequestException('Địa chỉ Email này đã được đăng ký');
      }

      await this.prismaService.subscribers.create({
        data: {
          email,
        },
      });

      throw new HttpException(
        'Đăng ký nhận thông báo thành công',
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ subscribers.service.ts -> create', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get all subscribers
  async findAll(query: FilterDto) {
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
        ...sortRangeDate,
      };

      if (search) {
        whereConditions.email = {
          contains: search,
          mode: 'insensitive',
        };
      }

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.subscribers.findMany({
          where: whereConditions,
          skip: Number(skip),
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.subscribers.count({
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
          data: FormatReturnData(res, []),
          paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ subscribers.service.ts -> findAll', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Update a subscriber
  async update(email: string, updateSubscriberDto: UpdateSubscriberDto) {
    try {
      const {
        is_receive,
        is_receive_blog,
        is_receive_notify,
        is_receive_sales,
      } = updateSubscriberDto;

      const findSubscriber = await this.prismaService.subscribers.findUnique({
        where: {
          email,
        },
      });

      if (!findSubscriber) {
        throw new NotFoundException('Không tìm thấy email này');
      }

      await this.prismaService.subscribers.update({
        where: {
          email,
        },
        data: {
          is_receive,
          is_receive_blog,
          is_receive_notify,
          is_receive_sales,
        },
      });

      throw new HttpException('Cập nhật thông báo thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ subscribers.service.ts -> update', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }
}
