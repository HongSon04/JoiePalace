import { DepositStatusEnum } from './../../helper/enum/deposit.enum';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateDepositDto } from './dto/update-status.dto';
import { FormatReturnData } from 'helper/FormatReturnData';
import { PaymentMethod } from 'helper/enum/payment_method.enum';

@Injectable()
export class DepositsService {
  constructor(private prismaService: PrismaService) {}

  // ? Find By ID
  async findOne(id: number) {
    try {
      const findDeposit = await this.prismaService.deposits.findUnique({
        where: { id: Number(id) },
      });
      if (!findDeposit) {
        throw new NotFoundException('Không tìm thấy giao dịch đặt cọc');
      }

      throw new HttpException(
        {
          message: 'Lấy chi tiết thông tin đặt cọc thành công',
          data: FormatReturnData(findDeposit, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ DepositsService->findOne: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ? Find By Transaction ID
  async findOneByTransactionId(transactionID: string) {
    try {
      const findDeposit = await this.prismaService.deposits.findUnique({
        where: { transactionID },
      });
      if (!findDeposit) {
        throw new NotFoundException('Không tìm thấy giao dịch đặt cọc');
      }

      throw new HttpException(
        {
          message: 'Lấy chi tiết thông tin đặt cọc thành công',
          data: FormatReturnData(findDeposit, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ DepositsService->findOneByTransactionId: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ? Update Status
  async update(id: number, updateDepositDto: UpdateDepositDto) {
    try {
      const { status, payment_method } = updateDepositDto;
      const findDeposit = await this.prismaService.deposits.findUnique({
        where: { id: Number(id) },
      });
      if (!findDeposit) {
        throw new NotFoundException('Không tìm thấy giao dịch đặt cọc');
      }
      const updateDeposit = await this.prismaService.deposits.update({
        where: { id: Number(id) },
        data: {
          status: status as DepositStatusEnum,
          payment_method: payment_method as PaymentMethod,
        },
      });
      // ? Find Booking Detail & booking to update status
      const findBookingDetail =
        await this.prismaService.booking_details.findFirst({
          where: { deposit_id: Number(id) },
        });

      if (!findBookingDetail) {
        throw new NotFoundException('Không tìm thấy thông tin đặt tiệc');
      }

      await this.prismaService.bookings.update({
        where: { id: Number(findBookingDetail.booking_id) },
        data: { is_deposit: status === 'completed' ? true : false },
      });

      throw new HttpException(
        {
          message: 'Cập nhật giao dịch đặt cọc thành công',
          data: FormatReturnData(updateDeposit, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ DepositsService->update: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ? Update Status by Transaction ID
  async updateByTransactionID(
    transactionID: string,
    updateDepositDto: UpdateDepositDto,
  ) {
    try {
      const { status, payment_method } = updateDepositDto;
      const findDeposit = await this.prismaService.deposits.findUnique({
        where: { transactionID },
      });
      if (!findDeposit) {
        throw new NotFoundException('Không tìm thấy giao dịch đặt cọc');
      }
      const updateDeposit = await this.prismaService.deposits.update({
        where: { transactionID },
        data: {
          status: status as DepositStatusEnum,
          payment_method: payment_method as PaymentMethod,
        },
      });
      // ? Find Booking Detail & booking to update status
      const findBookingDetail =
        await this.prismaService.booking_details.findFirst({
          where: { deposit_id: Number(findDeposit.id) },
        });

      if (!findBookingDetail) {
        throw new NotFoundException('Không tìm thấy thông tin đặt tiệc');
      }

      await this.prismaService.bookings.update({
        where: { id: Number(findBookingDetail.booking_id) },
        data: { is_deposit: status === 'completed' ? true : false },
      });

      throw new HttpException(
        {
          message: 'Cập nhật giao dịch đặt cọc thành công',
          data: FormatReturnData(updateDeposit, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ DepositsService->updateByTransactionID: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }
}
