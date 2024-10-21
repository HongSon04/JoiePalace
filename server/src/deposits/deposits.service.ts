import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateDepositDto } from './dto/update-status.dto';
import { FormatReturnData } from 'helper/FormatReturnData';

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
        throw new HttpException(
          'Không tìm thấy giao dịch đặt cọc',
          HttpStatus.NOT_FOUND,
        );
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
      throw new HttpException(
        'Có lỗi xảy ra khi tìm kiếm giao dịch đặt cọc',
        HttpStatus.INTERNAL_SERVER_ERROR,
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
        throw new HttpException(
          'Không tìm thấy giao dịch đặt cọc',
          HttpStatus.NOT_FOUND,
        );
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
      throw new HttpException(
        'Có lỗi xảy ra khi tìm kiếm giao dịch đặt cọc',
        HttpStatus.INTERNAL_SERVER_ERROR,
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
        throw new HttpException(
          'Không tìm thấy giao dịch đặt cọc',
          HttpStatus.NOT_FOUND,
        );
      }
      const updateDeposit = await this.prismaService.deposits.update({
        where: { id: Number(id) },
        data: { status, payment_method },
      });
      // ? Find Booking Detail & booking to update status
      const findBookingDetail =
        await this.prismaService.booking_details.findFirst({
          where: { deposit_id: Number(id) },
        });

      if (!findBookingDetail) {
        throw new HttpException(
          'Không tìm thấy thông tin đặt tiệc',
          HttpStatus.NOT_FOUND,
        );
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
      throw new HttpException(
        'Có lỗi xảy ra khi cập nhật giao dịch đặt cọc',
        HttpStatus.INTERNAL_SERVER_ERROR,
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
        throw new HttpException(
          'Không tìm thấy giao dịch đặt cọc',
          HttpStatus.NOT_FOUND,
        );
      }
      const updateDeposit = await this.prismaService.deposits.update({
        where: { transactionID },
        data: { status, payment_method },
      });
      // ? Find Booking Detail & booking to update status
      const findBookingDetail =
        await this.prismaService.booking_details.findFirst({
          where: { deposit_id: Number(findDeposit.id) },
        });

      if (!findBookingDetail) {
        throw new HttpException(
          'Không tìm thấy thông tin đặt tiệc',
          HttpStatus.NOT_FOUND,
        );
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
      throw new HttpException(
        'Có lỗi xảy ra khi cập nhật giao dịch đặt cọc',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
