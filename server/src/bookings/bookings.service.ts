import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
  FormatDateWithShift,
} from './../../helper/formatDate';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma.service';
import uniqid from 'uniqid';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';
import { UpdateStatusBookingDto } from './dto/update-status-booking.dto';
import { MailService } from 'src/mail/mail.service';
import dayjs from 'dayjs';

interface Accessories {
  table: [
    {
      id: number;
      name?: string;
      total_price?: number;
      description?: string;
      short_description?: string;
      images?: string[];
      type?: string;
      quantity: number;
      amount?: number;
    },
  ];
  chair: {
    id: number;
    name?: string;
    description?: string;
    short_description?: string;
    images?: string[];
    type?: string;
    quantity: number;
    total_price?: number;
    amount?: number;
  };
  extra_services?: [
    {
      id: number;
      name?: string;
      description?: string;
      short_description?: string;
      images?: string[];
      quantity: number;
      amount?: number;
      total_price?: number;
    },
  ];
  total_price?: number;
}

interface ExtraServices {
  id: number;
  name?: string;
  description?: string;
  short_description?: string;
  images?: string[];
  quantity: number;
  amount?: number;
  total_price?: number;
}

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
        throw new HttpException(
          'Đã có sự kiện tổ chức vào thời gian này',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (user_id != null || user_id != undefined) {
        const user = await this.prismaService.users.findUnique({
          where: { id: Number(user_id) },
        });
        if (!user) {
          throw new HttpException(
            'Không tìm thấy người dùng',
            HttpStatus.NOT_FOUND,
          );
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
        if (!entity)
          throw new HttpException(
            `Không tìm thấy ${name}`,
            HttpStatus.NOT_FOUND,
          );
      };
      validateExists(party_types, 'Loại tiệc');
      validateExists(branch, 'Chi nhánh');

      // Create Booking
      const booking = await this.prismaService.bookings.create({
        data: {
          user_id: Number(user_id),
          branch_id: Number(branch_id),
          company_name,
          email,
          note,
          party_type_id: Number(party_type_id),
          phone,
          name,
          organization_date,
          shift,
          number_of_guests: Number(number_of_guests),
        },
      });

      // Fetch booking with relations
      const findBooking = await this.prismaService.bookings.findUnique({
        where: { id: booking.id },
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
        { message: 'Đặt tiệc thành công', data: findBooking },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> create: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
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
      const minPrice = Math.max(0, Number(query.minPrice) || 0);
      const maxPrice = Math.max(minPrice, Number(query.maxPrice) || 99999999);

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
          {
            branchs: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            menus: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        ],
        ...sortRangeDate,
      };
      // ? Price Conditions
      if (minPrice >= 0) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({ amount: { gte: minPrice, lte: maxPrice } });
      }
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
                stages: true,
                spaces: true,
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
        { data: result, pagination: paginationInfo },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> findAll: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
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
      const minPrice = Math.max(0, Number(query.minPrice) || 0);
      const maxPrice = Math.max(minPrice, Number(query.maxPrice) || 99999999);

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
          {
            branchs: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            menus: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        ],
        ...sortRangeDate,
      };
      // ? Price Conditions
      if (minPrice >= 0) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({ amount: { gte: minPrice, lte: maxPrice } });
      }
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
                stages: true,
                spaces: true,
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
        { data: result, pagination: paginationInfo },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> findAllDeleted: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
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
          booking_details: {
            include: {
              stages: true,
              spaces: true,
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
        throw new HttpException(
          'Không tìm thấy đơn đặt tiệc',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(findBooking, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> findOne: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
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
        select: {
          id: true,
          name: true,
          organization_date: true,
          shift: true,
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
        throw new HttpException(
          'Không tìm thấy đơn đặt tiệc',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.prismaService.bookings.update({
        where: { id: Number(id) },
        data: {
          is_confirm,
          is_deposit,
          status,
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
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Update Booking
  async update(reqUser, id: number, updateBookingDto: UpdateBookingDto) {
    try {
      const {
        user_id,
        branch_id,
        space_id,
        stage_id,
        decor_id,
        menu_id,
        name,
        amount,
        accessories,
        company_name,
        email,
        note,
        number_of_guests,
        is_confirm,
        is_deposit,
        party_type_id,
        payment_method,
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

      // ! Update Booking
      await this.prismaService.bookings.update({
        where: { id: Number(id) },
        data: {
          user_id: Number(user_id),
          branch_id: Number(branch_id),
          name,
          company_name,
          email,
          note,
          number_of_guests: Number(number_of_guests),
          is_confirm,
          is_deposit,
          party_type_id,
          phone,
          status,
        },
      });

      let organization_date = FormatDateWithShift(
        findBooking.organization_date as any,
        findBooking.shift,
      );

      if (findBooking.is_confirm === false) {
        throw new HttpException(
          'Không thể sửa thông tin đơn đặt tiệc chưa xác nhận',
          HttpStatus.BAD_REQUEST,
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
          throw new HttpException(
            'Không thể sửa thông tin đơn đặt tiệc khi còn 3 ngày nữa là tổ chức',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Fetching user, branch, space, stage, decor, and menu in parallel
      const [user, branch, space, stage, decor, menu] = await Promise.all([
        this.prismaService.users.findUnique({ where: { id: Number(user_id) } }),
        this.prismaService.branches.findUnique({
          where: { id: Number(branch_id) },
        }),
        this.prismaService.spaces.findUnique({
          where: { id: Number(space_id) },
        }),
        this.prismaService.stages.findUnique({
          where: { id: Number(stage_id) },
        }),
        this.prismaService.decors.findUnique({
          where: { id: Number(decor_id) },
        }),
        this.prismaService.menus.findUnique({
          where: { id: Number(menu_id) },
          include: { products: true },
        }),
      ]);
      // Validate fetched data
      const validateExists = (entity: any, name: string) => {
        if (!entity)
          throw new HttpException(
            `Không tìm thấy ${name}`,
            HttpStatus.NOT_FOUND,
          );
      };
      validateExists(user, 'user');
      validateExists(branch, 'branch');
      validateExists(space, 'space');
      validateExists(stage, 'stage');
      validateExists(decor, 'decor');
      validateExists(menu, 'menu');
      // ? Calculate accessory amounts
      const {
        totalAmount: accessoriesTotal,
        totalTables,
        NewAccessories,
      } = await this.calculateAccessories(accessories as Accessories);
      // ? Check Stage capacity
      if (totalTables > stage.capacity)
        throw new HttpException(
          'Số lượng bàn vượt quá sức chứa của sảnh',
          HttpStatus.BAD_REQUEST,
        );

      // ? Format Accessories
      const accessoriesFormat = {
        ...NewAccessories,
        total_price: accessoriesTotal,
      };
      // ? Format Stage
      const {
        created_at: createdAtStage,
        updated_at: updatedAtStage,
        ...stageFormat
      } = stage;
      // ? Format Space
      const {
        created_at: createdAtSpace,
        updated_at: updatedAtSpace,
        ...spaceFormat
      } = space;

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
            Number(space.price) +
            Number(stage.price) +
            Number(accessoriesTotal) +
            Number(extraServiceAmount),
        );
        console.log('Total Amount:', totalAmount);
        console.log('FE Amount:', amount);
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
            where: { booking_id: findBooking.id },
            select: { deposit_id: true },
          });
        const findDeposit = await this.prismaService.deposits.findUnique({
          where: { id: findBookingDetail.deposit_id },
        });
        const depositAmount = findDeposit.amount;
        const bookingAmount = Number(
          (totalAmount + totalFee - depositAmount).toFixed(0),
        );

        // ! Update Booking
        await this.prismaService.booking_details.update({
          where: { booking_id: findBooking.id },
          data: {
            decor_id: Number(decor_id),
            stage_id: Number(stage_id),
            space_id: Number(space_id),
            menu_id: Number(menu_id),
            stage: stageFormat,
            space: spaceFormat,
            decor: decorFormat,
            menu: menuFormat,
            extra_service: extra_sevice,
            fee,
            accessories: accessoriesFormat,
            total_amount: Number(totalAmount),
            payment_method: payment_method as any,
            amount_booking: bookingAmount,
          },
        });

        // ! Fetch booking with relations
        const findBookings = await this.prismaService.bookings.findUnique({
          where: { id: findBooking.id },
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
            data: findBookings,
            deposit: findDeposit,
          },
          HttpStatus.OK,
        );
      } else {
        // Total calculation
        const totalAmount = Number(
          Number(decor.price) +
            Number(menu.price) +
            Number(space.price) +
            Number(stage.price) +
            Number(accessoriesTotal),
        );
        console.log('Total Amount:', totalAmount);
        console.log('FE Amount:', amount);
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
            amount: Number(depositAmount),
          },
        });

        // ! Create Or Update Booking
        const findBookingDetail =
          await this.prismaService.booking_details.findFirst({
            where: { booking_id: findBooking.id },
          });
        if (findBookingDetail) {
          //? Delete Old Deposit
          await this.prismaService.deposits.delete({
            where: { id: findBookingDetail.deposit_id },
          });
          await this.prismaService.booking_details.update({
            where: { booking_id: Number(findBookingDetail.id) },
            data: {
              decor_id: Number(decor_id),
              stage_id: Number(stage_id),
              space_id: Number(space_id),
              menu_id: Number(menu_id),
              stage: stageFormat,
              space: spaceFormat,
              decor: decorFormat,
              menu: menuFormat,
              extra_service: '',
              fee,
              accessories: accessoriesFormat,
              total_amount: totalAmount,
              deposit_id: deposit.id,
              payment_method: payment_method as any,
              amount_booking: Number(bookingAmount),
            },
          });
        } else {
          await this.prismaService.booking_details.create({
            data: {
              booking_id: Number(findBooking.id),
              decor_id: Number(decor_id),
              stage_id: Number(stage_id),
              space_id: Number(space_id),
              menu_id: Number(menu_id),
              stage: stageFormat,
              space: spaceFormat,
              decor: decorFormat,
              menu: menuFormat,
              extra_service: '',
              fee,
              accessories: accessoriesFormat,
              total_amount: totalAmount,
              deposit_id: deposit.id,
              payment_method: payment_method as any,
              amount_booking: Number(bookingAmount),
            },
          });
        }

        // ! Fetch booking with relations
        const findBookings = await this.prismaService.bookings.findUnique({
          where: { id: findBooking.id },
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
          { message: 'Cập nhật tiệc thành công', data: findBookings, deposit },
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
        throw new HttpException(
          'Không tìm thấy đơn đặt tiệc',
          HttpStatus.NOT_FOUND,
        );
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
        throw new HttpException(
          'Không tìm thấy đơn đặt tiệc',
          HttpStatus.NOT_FOUND,
        );
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
        throw new HttpException(
          'Không tìm thấy đơn đặt tiệc',
          HttpStatus.NOT_FOUND,
        );
      }

      // Xóa deposit nếu có
      if (booking.booking_details.length > 0) {
        const depositId = booking.booking_details[0].deposit_id;
        if (depositId) {
          await this.prismaService.deposits.delete({
            where: { id: depositId },
          });
        }
        await this.prismaService.booking_details.deleteMany({
          where: { booking_id: booking.id },
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
      );
    }
  }

  // ! Calculate accessory amounts
  private async calculateAccessories(accessories: Accessories) {
    let accessoriesAmount = 0;
    let totalTables = 0;

    // Fetch table prices in parallel
    const tablePromises = accessories.table.map(async (table) => {
      const findTable = await this.prismaService.funitures.findUnique({
        where: { id: Number(table.id) },
      });
      if (!findTable)
        throw new HttpException(
          'Không tìm thấy loại bàn',
          HttpStatus.NOT_FOUND,
        );
      accessoriesAmount += findTable.price * table.quantity;
      totalTables += table.quantity;
      table.name = findTable.name;
      table.amount = findTable.price;
      table.total_price = findTable.price * table.quantity;
      table.description = findTable.description;
      table.short_description = findTable.short_description;
      table.images = findTable.images;
      table.type = findTable.type;
      return findTable.price * table.quantity;
    });

    await Promise.all(tablePromises);

    // Fetch Extra Services
    const extraServicesPromise = accessories.extra_services.map(
      async (extra) => {
        const findExtra = await this.prismaService.products.findUnique({
          where: { id: Number(extra.id) },
        });
        if (!findExtra)
          throw new HttpException(
            'Không tìm thấy dịch vụ thêm',
            HttpStatus.NOT_FOUND,
          );
        accessoriesAmount += findExtra.price * extra.quantity;
        extra.name = findExtra.name;
        extra.amount = findExtra.price;
        extra.total_price = findExtra.price * extra.quantity;
        extra.quantity = extra.quantity;
        extra.description = findExtra.description;
        extra.short_description = findExtra.short_description;
        extra.images = findExtra.images;
        return findExtra.price * extra.quantity;
      },
    );

    // Calculate chair price (1 table = 10 chairs)
    const findChair = await this.prismaService.funitures.findUnique({
      where: { id: Number(accessories.chair.id) },
    });
    if (!findChair)
      throw new HttpException('Không tìm thấy loại ghế', HttpStatus.NOT_FOUND);
    accessories.chair.name = findChair.name;
    accessories.chair.amount = findChair.price;
    accessories.chair.description = findChair.description;
    accessories.chair.short_description = findChair.short_description;
    accessories.chair.images = findChair.images;
    accessories.chair.type = findChair.type;
    accessories.chair.quantity = totalTables * 10;
    accessories.chair.total_price = findChair.price * totalTables * 10;

    accessoriesAmount += findChair.price * totalTables * 10;
    return {
      totalAmount: accessoriesAmount,
      tableAmount: accessoriesAmount,
      totalTables,
      NewAccessories: accessories,
    };
  }
}
