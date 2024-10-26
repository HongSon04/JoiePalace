import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import dayjs from 'dayjs';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';
import { FormatReturnData } from 'helper/FormatReturnData';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';
import uniqid from 'uniqid';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
  FormatDateWithShift,
} from './../../helper/formatDate';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateStatusBookingDto } from './dto/update-status-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
  ) {}

  // ! Create Booking
  async create(createBookingDto: CreateBookingDto) {
    try {
      const {
        user_id,
        branch_id,
        stage_id,
        name,
        shift,
        company_name,
        email,
        note,
        party_type_id,
        number_of_guests,
        phone,
      } = createBookingDto;
      var { organization_date } = createBookingDto;
      organization_date = FormatDateWithShift(organization_date, shift);

      // ? Check Date And Shift is Exist
      const checkDateAndShift = await this.prismaService.bookings.findMany({
        where: {
          deleted: false,
          organization_date: {
            equals: organization_date,
          },
          shift,
        },
      });
      if (checkDateAndShift.length > 0) {
        throw new BadRequestException(
          'Đã có sự kiện tổ chức vào thời gian này',
        );
      }

      if (user_id != null || user_id != undefined) {
        const user = await this.prismaService.users.findUnique({
          where: { id: Number(user_id) },
        });
        if (!user) {
          throw new NotFoundException('Không tìm thấy người dùng');
        }
      }

      if (stage_id) {
        const findStage = await this.prismaService.stages.findUnique({
          where: { id: Number(stage_id) },
        });

        if (!findStage) {
          throw new NotFoundException('Không tìm thấy sảnh');
        }
      }

      // Fetching user, branch in parallel
      const [party_types, branch] = await Promise.all([
        this.prismaService.party_types.findUnique({
          where: { id: Number(party_type_id) },
        }),
        this.prismaService.branches.findUnique({
          where: { id: Number(branch_id) },
        }),
      ]);

      // Validate fetched data
      const validateExists = (entity: any, name: string) => {
        if (!entity) throw new NotFoundException(`Không tìm thấy ${name}`);
      };
      validateExists(party_types, 'Loại tiệc');
      validateExists(branch, 'Chi nhánh');

      // Create Booking
      const booking = await this.prismaService.bookings.create({
        data: {
          user_id: Number(user_id),
          branch_id: Number(branch_id),
          company_name: company_name ? company_name : null,
          email,
          note,
          party_type_id: Number(party_type_id),
          stage_id: stage_id ? Number(stage_id) : null,
          phone,
          name,
          organization_date,
          shift,
          number_of_guests: Number(number_of_guests),
        },
      });

      // Fetch booking with relations
      const findBooking = await this.prismaService.bookings.findUnique({
        where: { id: Number(booking.id) },
        include: {
          users: {
            select: {
              id: true,
              username: true,
              email: true,
              phone: true,
              avatar: true,
              memberships_id: true,
              role: true,
            },
          },
          branches: true,
          stages: true,
        },
      });

      // ? Send Mail
      const bodyMail = {
        shift,
        organization_date: dayjs(organization_date).format('DD/MM/YYYY'),
        branchName: branch.name,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        branchAddress: branch.address,
      };
      await this.mailService.sendUserConfirmationBooking(bodyMail);
      throw new HttpException(
        {
          message: 'Đặt tiệc thành công',
          data: FormatReturnData(findBooking, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> create: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Find All Booking
  async findAll(query: FilterPriceDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;
      const priceSort = query?.priceSort?.toLowerCase();
      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : '';
      const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : '';

      // ? Range Date Conditions
      const sortRangeDate: any =
        startDate && endDate
          ? {
              created_at: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {};
      // ? Where Conditions
      const whereConditions: any = {
        deleted: false,
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
        ...sortRangeDate,
      };
      // ? Date Conditions
      if (startDate && endDate) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({
          created_at: { gte: startDate, lte: endDate },
        });
      }
      // ? Sort Conditions
      let orderByConditions: any = {};
      if (priceSort === 'asc' || priceSort === 'desc') {
        orderByConditions.price = priceSort;
      }
      // ? Fetch Data
      const [result, total] = await this.prismaService.$transaction([
        this.prismaService.bookings.findMany({
          where: whereConditions,
          include: {
            users: {
              select: {
                id: true,
                username: true,
                email: true,
                memberships_id: true,
                phone: true,
                avatar: true,
                role: true,
              },
            },
            branches: true,
            booking_details: {
              include: {
                decors: true,
                menus: {
                  include: {
                    products: {
                      include: {
                        tags: true,
                      },
                    },
                  },
                },
                deposits: true,
              },
            },
            stages: true,
          },
          orderBy: orderByConditions,
          skip,
          take: itemsPerPage,
        }),
        this.prismaService.bookings.count({
          where: whereConditions,
        }),
      ]);
      // ? Pagination
      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        nextPage: page + 1 > lastPage ? null : page + 1,
        prevPage: page - 1 <= 0 ? null : page - 1,
        lastPage: lastPage,
        itemsPerPage,
        currentPage: page,
        total,
      };
      // ? Response
      throw new HttpException(
        { data: FormatReturnData(result, []), pagination: paginationInfo },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> findAll: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Find All Deleted Booking
  async findAllDeleted(query: FilterPriceDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;
      const priceSort = query?.priceSort?.toLowerCase();
      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : '';
      const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : '';

      // ? Range Date Conditions
      const sortRangeDate: any =
        startDate && endDate
          ? {
              created_at: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {};
      // ? Where Conditions
      const whereConditions: any = {
        deleted: true,
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
        ...sortRangeDate,
      };
      // ? Date Conditions
      if (startDate && endDate) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({
          created_at: { gte: startDate, lte: endDate },
        });
      }
      // ? Sort Conditions
      let orderByConditions: any = {};
      if (priceSort === 'asc' || priceSort === 'desc') {
        orderByConditions.price = priceSort;
      }
      // ? Fetch Data
      const [result, total] = await this.prismaService.$transaction([
        this.prismaService.bookings.findMany({
          where: whereConditions,
          include: {
            users: {
              select: {
                id: true,
                username: true,
                email: true,
                memberships_id: true,
                phone: true,
                avatar: true,
                role: true,
              },
            },
            stages: true,
            branches: true,
            booking_details: {
              include: {
                decors: true,
                menus: {
                  include: {
                    products: {
                      include: {
                        tags: true,
                      },
                    },
                  },
                },
                deposits: true,
              },
            },
          },
          orderBy: orderByConditions,
          skip,
          take: itemsPerPage,
        }),
        this.prismaService.bookings.count({
          where: whereConditions,
        }),
      ]);
      // ? Pagination
      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        nextPage: page + 1 > lastPage ? null : page + 1,
        prevPage: page - 1 <= 0 ? null : page - 1,
        lastPage: lastPage,
        itemsPerPage,
        currentPage: page,
        total,
      };
      // ? Response
      throw new HttpException(
        { data: FormatReturnData(result, []), pagination: paginationInfo },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> findAllDeleted: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Find One Booking
  async findOne(id: number) {
    try {
      const findBooking = await this.prismaService.bookings.findUnique({
        where: { id: Number(id) },
        include: {
          users: {
            select: {
              id: true,
              username: true,
              email: true,
              memberships_id: true,
              phone: true,
              avatar: true,
              role: true,
            },
          },
          branches: true,
          stages: true,
          booking_details: {
            include: {
              decors: true,
              menus: {
                include: {
                  products: true,
                },
              },
              deposits: true,
            },
          },
        },
      });
      if (!findBooking) {
        throw new NotFoundException('Không tìm thấy đơn đặt tiệc');
      }
      throw new HttpException(
        {
          message: 'Lấy dữ liệu đặt chỗ thành công',
          data: FormatReturnData(findBooking, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> findOne: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Get Booking For Next 2 Weeks to 5 Weeks
  async getBookingForNext14Days() {
    try {
      const currentDate = new Date();
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() + 14);
      endDate.setDate(currentDate.getDate() + 35);

      const bookings = await this.prismaService.bookings.findMany({
        where: {
          organization_date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          stages: true,
        },
      });

      // Tạo một Map để tra cứu booking nhanh hơn
      const bookingMap = new Map();
      for (const booking of bookings) {
        const dateKey = new Date(booking.organization_date).toDateString();
        bookingMap.set(`${dateKey}-${booking.shift}`, booking);
      }

      const response = [];
      const shifts = ['Sáng', 'Tối'];

      for (let i = 14; i <= 35; i++) {
        const dateToCheck = new Date(currentDate);
        dateToCheck.setDate(currentDate.getDate() + i);
        const dateKey = dateToCheck.toDateString();

        for (const shift of shifts) {
          const existingBooking = bookingMap.get(`${dateKey}-${shift}`);
          const organi_date = dateToCheck.toISOString().split('T')[0];
          const [year, month, date] = organi_date.split('-');

          response.push({
            id: existingBooking ? existingBooking.id : null,
            name: existingBooking ? existingBooking.name : null,
            organization_date: `${date}-${month}-${year}`,
            shift: shift,
            status: !!existingBooking,
          });
        }
      }

      throw new HttpException(
        {
          message: 'Lấy dữ liệu đặt chỗ thành công!',
          data: response,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ booking.service.ts -> getBookingForNext14Days: ',
        error,
      );
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // !! Update Status Booking
  async updateStatus(
    id: number,
    updateStatusBoookingDto: UpdateStatusBookingDto,
  ) {
    try {
      const { is_confirm, is_deposit, status } = updateStatusBoookingDto;
      const findBooking = await this.prismaService.bookings.findUnique({
        where: { id: Number(id) },
      });
      if (!findBooking) {
        throw new NotFoundException('Không tìm thấy đơn đặt tiệc');
      }
      await this.prismaService.bookings.update({
        where: { id: Number(id) },
        data: {
          is_confirm,
          is_deposit,
          status: status as BookingStatus,
        },
      });
      throw new HttpException(
        'Cập nhật trạng thái đơn đặt tiệc thành công',
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> updateStatus: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Update Booking
  async update(reqUser, id: number, updateBookingDto: UpdateBookingDto) {
    try {
      const {
        user_id,
        branch_id,
        stage_id,
        decor_id,
        menu_id,
        name,
        amount,
        company_name,
        email,
        note,
        number_of_guests,
        is_confirm,
        is_deposit,
        party_type_id,
        table_count,
        phone,
        extra_sevice,
        status,
      } = updateBookingDto;

      const findBooking = await this.prismaService.bookings.findUnique({
        where: { id: Number(id) },
      });
      if (!findBooking) {
        throw new HttpException(
          'Không tìm thấy đơn đặt tiệc',
          HttpStatus.NOT_FOUND,
        );
      }

      const findStages = await this.prismaService.stages.findUnique({
        where: { id: Number(stage_id) },
      });

      if (!findStages) {
        throw new NotFoundException('Không tìm thấy sảnh');
      }

      // ! Update Booking
      await this.prismaService.bookings.update({
        where: { id: Number(id) },
        data: {
          user_id: Number(user_id),
          branch_id: Number(branch_id),
          name,
          company_name: company_name ? company_name : null,
          email,
          note,
          number_of_guests: Number(number_of_guests),
          is_confirm,
          is_deposit,
          party_type_id,
          phone,
          status: status as BookingStatus,
        },
      });

      let organization_date = FormatDateWithShift(
        findBooking.organization_date as any,
        findBooking.shift,
      );

      if (findBooking.is_confirm === false) {
        throw new BadRequestException(
          'Không thể sửa thông tin đơn đặt tiệc chưa xác nhận',
        );
      }

      // ? Nếu mà ngày tổ chức chỉ còn 3 ngày nữa là tổ chức thì sẽ không cho sửa
      if (reqUser.role == 'user') {
        const currentDate = new Date();
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() + 7);
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + 3);
        if (new Date(organization_date) < endDate) {
          throw new BadRequestException(
            'Không thể sửa thông tin đơn đặt tiệc khi còn 3 ngày nữa là tổ chức',
          );
        }
      }

      // Fetching user, branch,  stage, decor, and menu in parallel
      const [user, branch, stage, decor, menu, party_types] = await Promise.all(
        [
          this.prismaService.users.findUnique({
            where: { id: Number(user_id) },
          }),
          this.prismaService.branches.findUnique({
            where: { id: Number(branch_id) },
          }),
          this.prismaService.stages.findUnique({
            where: { id: Number(stage_id) },
          }),
          this.prismaService.decors.findUnique({
            where: { id: Number(decor_id) },
            include: { products: true },
          }),
          this.prismaService.menus.findUnique({
            where: { id: Number(menu_id) },
            include: { products: true },
          }),
          this.prismaService.party_types.findUnique({
            where: { id: Number(party_type_id) },
            include: { products: true },
          }),
        ],
      );
      // Validate fetched data
      const validateExists = (entity: any, name: string) => {
        if (!entity) throw new NotFoundException(`Không tìm thấy ${name}`);
      };
      validateExists(user, 'user');
      validateExists(branch, 'branch');
      validateExists(stage, 'stage');
      validateExists(decor, 'decor');
      validateExists(menu, 'menu');
      // ? Calculate accessory amounts
      let tableAmount = table_count * 100000; // 100.000 VND / bàn
      let chair_count = table_count * 10;
      let chairAmount = chair_count * 20000; // 20.000 VND / ghế

      if (table_count > findStages.capacity_max) {
        throw new BadRequestException(
          'Số lượng bàn vượt quá sức chứa của sảnh',
        );
      }

      if (table_count < findStages.capacity_min) {
        throw new BadRequestException(
          'Số lượng bàn quá ít so với sức chứa tối thiểu của sảnh',
        );
      }

      // ? Format Stage
      const {
        created_at: createdAtStage,
        updated_at: updatedAtStage,
        ...stageFormat
      } = stage;

      // ? Format Decor
      const {
        created_at: createdAtDecor,
        updated_at: updatedAtDecor,
        ...decorFormat
      } = decor;

      // ? Format Menu
      const {
        created_at: createdAtMenu,
        updated_at: updatedAtMenu,
        ...menuFormat
      } = menu;

      // ? Format Party Type
      const {
        created_at: createdAtPartyType,
        updated_at: updatedAtPartyType,
        ...partyTypeFormat
      } = party_types;

      // ! Check is_deposit or not
      if (findBooking.is_deposit === true) {
        let extraServiceAmount = 0;
        // ! Fetch booking with relations
        extra_sevice.map(async (extra) => {
          const findExtra = await this.prismaService.products.findUnique({
            where: { id: Number(extra.id) },
          });
          if (!findExtra)
            throw new HttpException(
              'Không tìm thấy dịch vụ thêm',
              HttpStatus.NOT_FOUND,
            );
          extraServiceAmount += findExtra.price * extra.quantity;
          extra.name = findExtra.name;
          extra.amount = findExtra.price;
          extra.total_price = findExtra.price * extra.quantity;
          extra.description = findExtra.description;
          extra.short_description = findExtra.short_description;
          extra.images = findExtra.images;
          extra.quantity = extra.quantity;
          extraServiceAmount += findExtra.price * extra.quantity;
        });
        // Total calculation
        const totalAmount = Number(
          Number(decor.price) +
            Number(menu.price) +
            Number(stage.price) +
            Number(party_types.price) +
            Number(tableAmount) +
            Number(chairAmount) +
            Number(extraServiceAmount),
        );
        if (Number(amount) !== totalAmount) {
          throw new HttpException(
            'Lỗi tính toán tổng tiền',
            HttpStatus.BAD_REQUEST,
          );
        }
        // Calculate Fees
        const fee = 10 / 100; // 10%
        const totalFee = totalAmount * fee; // 10%
        // ! Find Deposit By Booking Relations
        const findBookingDetail =
          await this.prismaService.booking_details.findFirst({
            where: { booking_id: Number(findBooking.id) },
            select: { deposit_id: true },
          });
        const findDeposit = await this.prismaService.deposits.findUnique({
          where: { id: Number(findBookingDetail.deposit_id) },
        });
        const depositAmount = findDeposit.amount;
        const bookingAmount = Number(
          (totalAmount + totalFee - depositAmount).toFixed(0),
        );

        // ! Update Booking
        await this.prismaService.booking_details.update({
          where: { booking_id: Number(findBooking.id) },
          data: {
            decor_id: Number(decor_id),
            menu_id: Number(menu_id),
            decor: decorFormat,
            menu: menuFormat,
            extra_service: extra_sevice,
            fee,
            total_amount: Number(totalAmount),
            amount_booking: bookingAmount,
          },
        });

        // ! Fetch booking with relations
        const findBookings = await this.prismaService.bookings.findUnique({
          where: { id: Number(findBooking.id) },
          include: {
            users: {
              select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                avatar: true,
                memberships_id: true,
                role: true,
              },
            },
            branches: true,
            party_types: true,
            booking_details: true,
          },
        });

        throw new HttpException(
          {
            message: 'Cập nhật tiệc thành công',
            data: FormatReturnData(findBookings, []),
            deposit: FormatReturnData(findDeposit, []),
          },
          HttpStatus.OK,
        );
      } else {
        // Total calculation
        const totalAmount = Number(
          Number(decor.price) +
            Number(menu.price) +
            Number(stage.price) +
            Number(party_types.price) +
            Number(tableAmount) +
            Number(chairAmount),
        );
        if (Number(amount) !== totalAmount) {
          throw new HttpException(
            'Lỗi tính toán tổng tiền',
            HttpStatus.BAD_REQUEST,
          );
        }
        // Calculate Fees
        const fee = 10 / 100; // 10%
        const totalFee = totalAmount * fee; // 10%
        const depositAmount = ((totalAmount + totalFee) * 0.3).toFixed(0); // 30%
        const bookingAmount = ((totalAmount + totalFee) * 0.7).toFixed(0); // 70%

        // Create Deposit
        const deposit = await this.prismaService.deposits.create({
          data: {
            transactionID: uniqid().toUpperCase(),
            name: `Tiền cọc tiệc của ${user.username}`,
            phone: user.phone,
            email: user.email,
            payment_method: null,
            amount: Number(depositAmount),
          },
        });

        // ! Create Or Update Booking
        const findBookingDetail =
          await this.prismaService.booking_details.findFirst({
            where: { booking_id: Number(findBooking.id) },
          });
        if (findBookingDetail) {
          //? Delete Old Deposit
          await this.prismaService.deposits.delete({
            where: { id: Number(findBookingDetail.deposit_id) },
          });
          await this.prismaService.booking_details.update({
            where: { booking_id: Number(findBookingDetail.id) },
            data: {
              decor_id: Number(decor_id),
              menu_id: Number(menu_id),
              decor: decorFormat,
              menu: menuFormat,
              extra_service: null,
              gift: null,

              fee,
              total_amount: totalAmount,
              deposit_id: deposit.id,
              amount_booking: Number(bookingAmount),
            },
          });
        } else {
          await this.prismaService.booking_details.create({
            data: {
              booking_id: Number(findBooking.id),
              decor_id: Number(decor_id),
              menu_id: Number(menu_id),
              party_types: partyTypeFormat,
              decor: decorFormat,
              menu: menuFormat,
              extra_service: null,
              gift: null,
              fee,
              total_amount: totalAmount,
              deposit_id: deposit.id,
              amount_booking: Number(bookingAmount),
            },
          });
        }

        // ! Fetch booking with relations
        const findBookings = await this.prismaService.bookings.findUnique({
          where: { id: Number(findBooking.id) },
          include: {
            users: {
              select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                avatar: true,
                memberships_id: true,
                role: true,
              },
            },
            branches: true,
            booking_details: true,
          },
        });

        throw new HttpException(
          {
            message: 'Cập nhật tiệc thành công',
            data: FormatReturnData(findBookings, []),
            deposit: FormatReturnData(deposit, []),
          },
          HttpStatus.OK,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> update: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Soft Delete Booking
  async delete(reqUser, id: number) {
    try {
      const findBooking = await this.prismaService.bookings.findUnique({
        where: { id: Number(id) },
      });
      if (!findBooking) {
        throw new NotFoundException('Không tìm thấy đơn đặt tiệc');
      }

      await this.prismaService.bookings.update({
        where: { id: Number(id) },
        data: {
          deleted: true,
          deleted_at: new Date(),
          deleted_by: reqUser.id,
        },
      });

      throw new HttpException('Hủy đơn đặt tiệc thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> delete: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Restore Booking
  async restore(id: number) {
    try {
      const findBooking = await this.prismaService.bookings.findUnique({
        where: { id: Number(id) },
      });
      if (!findBooking) {
        throw new NotFoundException('Không tìm thấy đơn đặt tiệc');
      }

      await this.prismaService.bookings.update({
        where: { id: Number(id) },
        data: {
          deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
      });

      throw new HttpException(
        'Khôi phục đơn đặt tiệc thành công',
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> restore: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Destroy Booking
  async destroy(id: number) {
    try {
      const booking = await this.prismaService.bookings.findUnique({
        where: { id: Number(id) },
        include: {
          booking_details: {
            include: {
              deposits: true,
            },
          },
        },
      });

      if (!booking) {
        throw new NotFoundException('Không tìm thấy đơn đặt tiệc');
      }

      // Xóa deposit nếu có
      if (booking.booking_details.length > 0) {
        const depositId = booking.booking_details[0].deposit_id;
        if (depositId) {
          await this.prismaService.deposits.delete({
            where: { id: Number(depositId) },
          });
        }
        await this.prismaService.booking_details.deleteMany({
          where: { booking_id: Number(booking.id) },
        });
      }

      await this.prismaService.bookings.delete({
        where: { id: Number(id) },
      });

      throw new HttpException('Xóa đơn đặt tiệc thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> destroy: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Calculate accessory amounts
  private async calculateAccessories(accessories) {
    let accessoriesAmount = 0;
    let totalTables = 0;

    // // Fetch table prices in parallel
    // const tablePromises = accessories.table.map(async (table) => {
    //   const findTable = await this.prismaService.funitures.findUnique({
    //     where: { id: Number(table.id) },
    //   });
    //   if (!findTable)
    //     throw new HttpException(
    //       'Không tìm thấy loại bàn',
    //       HttpStatus.NOT_FOUND,
    //     );
    //   accessoriesAmount += findTable.price * table.quantity;
    //   totalTables += table.quantity;
    //   table.name = findTable.name;
    //   table.amount = findTable.price;
    //   table.total_price = findTable.price * table.quantity;
    //   table.description = findTable.description;
    //   table.short_description = findTable.short_description;
    //   table.images = findTable.images;
    //   table.type = findTable.type;
    //   return findTable.price * table.quantity;
    // });

    // await Promise.all(tablePromises);

    // // Fetch Extra Services
    // const extraServicesPromise = accessories.extra_services.map(
    //   async (extra) => {
    //     const findExtra = await this.prismaService.products.findUnique({
    //       where: { id: Number(extra.id) },
    //     });
    //     if (!findExtra)
    //       throw new HttpException(
    //         'Không tìm thấy dịch vụ thêm',
    //         HttpStatus.NOT_FOUND,
    //       );
    //     accessoriesAmount += findExtra.price * extra.quantity;
    //     extra.name = findExtra.name;
    //     extra.amount = findExtra.price;
    //     extra.total_price = findExtra.price * extra.quantity;
    //     extra.quantity = extra.quantity;
    //     extra.description = findExtra.description;
    //     extra.short_description = findExtra.short_description;
    //     extra.images = findExtra.images;
    //     return findExtra.price * extra.quantity;
    //   },
    // );

    // // Calculate chair price (1 table = 10 chairs)
    // const findChair = await this.prismaService.funitures.findUnique({
    //   where: { id: Number(accessories.chair.id) },
    // });
    // if (!findChair)
    //   throw new HttpException('Không tìm thấy loại ghế', HttpStatus.NOT_FOUND);
    // accessories.chair.name = findChair.name;
    // accessories.chair.amount = findChair.price;
    // accessories.chair.description = findChair.description;
    // accessories.chair.short_description = findChair.short_description;
    // accessories.chair.images = findChair.images;
    // accessories.chair.type = findChair.type;
    // accessories.chair.quantity = totalTables * 10;
    // accessories.chair.total_price = findChair.price * totalTables * 10;

    // accessoriesAmount += findChair.price * totalTables * 10;
    accessoriesAmount = 0;
    return {
      totalAmount: accessoriesAmount,
      tableAmount: accessoriesAmount,
      totalTables,
      NewAccessories: accessories,
    };
  }
}
