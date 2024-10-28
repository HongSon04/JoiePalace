import { booking_details } from './../../node_modules/.prisma/client/index.d';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { BookingStatus } from 'helper/enum/booking_status.enum';
import { TypeNotifyEnum } from 'helper/enum/type_notify.enum';
import { FormatReturnData } from 'helper/FormatReturnData';
import { MailService } from 'src/mail/mail.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma.service';
import uniqid from 'uniqid';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
  FormatDateWithShift,
} from './../../helper/formatDate';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FilterBookingDto } from './dto/FilterBookingDto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateStatusBookingDto } from './dto/update-status-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
    private notificationService: NotificationsService,
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
        budget,
        organization_date,
      } = createBookingDto;

      const formattedDate = FormatDateWithShift(organization_date, shift);

      // Check Date And Shift is Exist
      const checkDateAndShift = await this.prismaService.bookings.findMany({
        where: {
          deleted: false,
          organization_date: { equals: formattedDate },
          shift,
        },
      });
      if (checkDateAndShift.length > 0) {
        throw new BadRequestException(
          'Đã có sự kiện tổ chức vào thời gian này',
        );
      }

      // Fetching user, branch, party type, and stage in parallel
      const [user, partyType, branch, stage] = await Promise.all([
        user_id
          ? this.prismaService.users.findUnique({
              where: { id: Number(user_id) },
            })
          : null,
        this.prismaService.party_types.findUnique({
          where: { id: Number(party_type_id) },
        }),
        this.prismaService.branches.findUnique({
          where: { id: Number(branch_id) },
        }),
        stage_id
          ? this.prismaService.stages.findUnique({
              where: { id: Number(stage_id) },
            })
          : null,
      ]);

      // Validate fetched data
      if (user_id && !user)
        throw new NotFoundException('Không tìm thấy người dùng');
      if (stage_id && !stage)
        throw new NotFoundException('Không tìm thấy sảnh');
      if (!partyType) throw new NotFoundException('Không tìm thấy loại tiệc');
      if (!branch) throw new NotFoundException('Không tìm thấy chi nhánh');

      // Create Booking
      const booking = await this.prismaService.bookings.create({
        data: {
          user_id: Number(user_id),
          branch_id: Number(branch_id),
          company_name: company_name || null,
          email,
          note,
          party_type_id: Number(party_type_id),
          stage_id: stage_id ? Number(stage_id) : null,
          phone,
          name,
          organization_date: formattedDate,
          shift,
          budget,
          number_of_guests: Number(number_of_guests),
        },
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

      // Prepare notification and email content
      const contents = {
        name: `Đơn đặt tiệc mới từ ${name}`,
        contents: `Đơn đặt tiệc mới từ ${name}, vào ngày ${dayjs(formattedDate).format('DD/MM/YYYY')}, vào ca ${shift}, vui lòng kiểm tra và xác nhận!`,
        branch_id,
        type: TypeNotifyEnum.BOOKING_CREATED,
      };

      // Send Notification
      await this.notificationService.sendNotifications(
        contents.name,
        contents.contents,
        contents.branch_id,
        contents.type,
      );

      // Send Mail
      const bodyMail = {
        shift,
        organization_date: dayjs(formattedDate).format('DD/MM/YYYY'),
        branchName: branch.name,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        branchAddress: branch.address,
      };
      await this.mailService.sendUserConfirmationBooking(bodyMail);

      // Trả về thông báo thành công
      throw new HttpException(
        {
          message: 'Đặt tiệc thành công',
          data: FormatReturnData(booking, []),
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
  async findAll(query: FilterBookingDto) {
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
      const is_confirm = query.is_confirm;
      const is_deposit = query.is_deposit;
      const status = query.status;

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
            company_name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            phone: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }

      if (is_confirm !== undefined) {
        whereConditions.is_confirm = Boolean(!is_confirm);
      }

      if (is_deposit !== undefined) {
        whereConditions.is_deposit = Boolean(!is_deposit);
      }

      if (status) {
        whereConditions.status = status;
      }

      // ? Date Conditions
      if (startDate && endDate) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({
          created_at: { gte: startDate, lte: endDate },
        });
      }
      // ? Sort Conditions

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
          orderBy: {
            created_at: 'desc',
          },
          skip,
          take: itemsPerPage,
        }),
        this.prismaService.bookings.count({
          where: whereConditions,
        }),
      ]);

      if (priceSort === 'asc' || priceSort === 'desc') {
        result.sort((a, b) => {
          const totalA = a.booking_details.reduce(
            (sum, detail) => sum + detail.total_amount,
            0,
          );
          const totalB = b.booking_details.reduce(
            (sum, detail) => sum + detail.total_amount,
            0,
          );
          return priceSort === 'asc' ? totalA - totalB : totalB - totalA;
        });
      }
      
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
  async findAllDeleted(query: FilterBookingDto) {
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
      const is_confirm = query.is_confirm;
      const is_deposit = query.is_deposit;
      const status = query.status;

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
        ...sortRangeDate,
      };

      if (is_confirm !== undefined) {
        whereConditions.is_confirm = Boolean(!is_confirm);
      }

      if (is_deposit !== undefined) {
        whereConditions.is_deposit = Boolean(!is_deposit);
      }

      if (status) {
        whereConditions.status = status;
      }

      if (search) {
        whereConditions.OR = [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            company_name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            phone: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }

      // ? Date Conditions
      if (startDate && endDate) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({
          created_at: { gte: startDate, lte: endDate },
        });
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
          orderBy: {
            created_at: 'desc',
          },
          skip,
          take: itemsPerPage,
        }),
        this.prismaService.bookings.count({
          where: whereConditions,
        }),
      ]);
      if (priceSort === 'asc' || priceSort === 'desc') {
        result.sort((a, b) => {
          const totalA = a.booking_details.reduce(
            (sum, detail) => sum + detail.total_amount,
            0,
          );
          const totalB = b.booking_details.reduce(
            (sum, detail) => sum + detail.total_amount,
            0,
          );
          return priceSort === 'asc' ? totalA - totalB : totalB - totalA;
        });
      }
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
          stages: {
            select: {
              id: true,
              name: true,
              // Chọn các trường cần thiết khác nếu cần
            },
          },
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

      // ! Send Notification
      const contents: any = {
        name: `Đơn đặt tiệc của ${findBooking.name}`,
        branch_id: findBooking.branch_id,
      };

      if (is_confirm === true) {
        contents.contents = `Đơn đặt tiệc của ${findBooking.name} đã được xác nhận!`;
        contents.type = TypeNotifyEnum.BOOKING_CONFIRM;
      } else if (is_deposit === true) {
        contents.contents = `Đơn đặt tiệc của ${findBooking.name} đã được đặt cọc!`;
        contents.type = TypeNotifyEnum.BOOKING_UPDATED;
      } else if (status === 'cancel') {
        contents.contents = `Đơn đặt tiệc của ${findBooking.name} đã bị hủy!`;
        contents.type = TypeNotifyEnum.BOOKING_CANCEL;
      } else if (status === 'processing') {
        contents.contents = `Đơn đặt tiệc của ${findBooking.name} đang được tổ chức!`;
        contents.type = TypeNotifyEnum.BOOKING_UPDATED;
      } else if (status === 'success') {
        contents.contents = `Đơn đặt tiệc của ${findBooking.name} đã được tiến hành!`;
        contents.type = TypeNotifyEnum.BOOKING_SUCCESS;
      } else {
        contents.contents = `Đơn đặt tiệc của ${findBooking.name} đã cập nhật!`;
        contents.type = TypeNotifyEnum.BOOKING_UPDATED;
      }

      await this.notificationService.sendNotifications(
        contents.name,
        contents.contents,
        contents.branch_id,
        contents.type,
      );

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
        extra_service,
        status,
      } = updateBookingDto;

      // Fetch the booking and related data in parallel to minimize database calls
      const [findBooking, findStages] = await Promise.all([
        this.prismaService.bookings.findUnique({
          where: { id: Number(id) },
        }),
        this.prismaService.stages.findUnique({
          where: { id: Number(stage_id) },
        }),
      ]);

      if (!findBooking) {
        throw new NotFoundException('Không tìm thấy đơn đặt tiệc');
      }
      if (!findStages) {
        throw new NotFoundException('Không tìm thấy sảnh');
      }

      // ? Check date_organization and shift is exist or not with another booking in the same branch and shift time and stages
      const formattedDate = FormatDateWithShift(
        findBooking.organization_date as any,
        findBooking.shift,
      );

      const checkDateAndShift = await this.prismaService.bookings.findMany({
        where: {
          deleted: false,
          organization_date: { equals: formattedDate },
          shift: findBooking.shift,
          branch_id: findBooking.branch_id,
          stage_id: Number(stage_id),
        },
      });

      if (checkDateAndShift.length > 0) {
        throw new BadRequestException(
          'Đã có sự kiện tổ chức vào thời gian này',
        );
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

      if (!findBooking.is_confirm) {
        throw new BadRequestException(
          'Không thể sửa thông tin đơn đặt tiệc khi chưa xác nhận',
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
          user_id
            ? this.prismaService.users.findUnique({
                where: { id: Number(user_id) },
              })
            : null,
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
        extra_service.map(async (extra) => {
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
            table_count,
            chair_count,
            extra_service: extra_service,
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

        // ! Send Notification
        const contents: any = {
          name: `Đơn đặt tiệc của ${findBooking.name}`,
          content: `Đơn đặt tiệc của ${findBooking.name} đã được cập nhật!`,
          branch_id: findBooking.branch_id,
          type: TypeNotifyEnum.BOOKING_UPDATED,
        };

        await this.notificationService.sendNotifications(
          contents.name,
          contents.content,
          contents.branch_id,
          contents.type,
        );

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

        // ! Send Notification
        const contents: any = {
          name: `Đơn đặt tiệc của ${findBooking.name}`,
          content: `Đơn đặt tiệc của ${findBooking.name} đã được cập nhật!`,
          branch_id: findBooking.branch_id,
          type: TypeNotifyEnum.BOOKING_UPDATED,
        };

        await this.notificationService.sendNotifications(
          contents.name,
          contents.content,
          contents.branch_id,
          contents.type,
        );

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

  // ! Cron Job check booking expired_at and delete it
  @Cron('0 */2 * * *')
  async handleBookingExpiredCron() {
    try {
      const currentDate = new Date();
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          deleted: false,
          expired_at: {
            gte: currentDate,
          },
        },
      });

      // Xóa booking nếu hết hạn
      bookings.map(async (booking) => {
        // ? Xóa booking
        await this.prismaService.bookings.update({
          where: { id: Number(booking.id) },
          data: {
            deleted: true,
            deleted_at: new Date(),
            deleted_by: 1,
            status: 'cancel',
          },
        });
      });
    } catch (error) {
      console.log('Lỗi từ booking.service.ts -> handleCron: ', error);
    }
  }

  // ! Send Email Booking if is_deposit is false
  // ! Cron Job Run Every Day at 8:00 AM
  @Cron('0 8 * * *')
  async handleBookingEmailCron() {
    try {
      const currentDate = new Date();
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          deleted: false,
          is_deposit: false,
          organization_date: {
            gte: currentDate,
          },
        },
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
      });

      // Prepare notification and email content
      bookings.map(async (booking) => {
        const { name, email, phone, organization_date, shift, branches } =
          booking;
        const formattedDate = FormatDateWithShift(
          organization_date as any,
          shift,
        );

        // Send Mail
        const bodyMail = {
          shift,
          organization_date: dayjs(formattedDate).format('DD/MM/YYYY'),
          branchName: branches.name,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          branchAddress: branches.address,
        };
        await this.mailService.sendUserConfirmationBooking(bodyMail);
      });
    } catch (error) {
      console.log(
        'Lỗi từ booking.service.ts -> handleBookingEmailCron: ',
        error,
      );
    }
  }
}
