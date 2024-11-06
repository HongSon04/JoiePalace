import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
        branch_id: Number(branch_id),
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
      await this.mailService.EmailAppointmentSuccessful(bodyMail);

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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Find All Booking
  async findAll(query: FilterBookingDto) {
    try {
      // Parse pagination params
      const page = query.page ? parseInt(query.page, 10) : 1;
      const itemsPerPage = query.itemsPerPage
        ? parseInt(query.itemsPerPage, 10)
        : 10;
      const skip = (page - 1) * itemsPerPage;

      // Convert deleted to proper boolean
      const deleted = query.deleted == true ? true : false;
      // Build where conditions using Prisma types
      const whereConditions: any = {
        deleted,
        ...(query.startDate &&
          query.endDate && {
            created_at: {
              gte: FormatDateToStartOfDay(query.startDate),
              lte: FormatDateToEndOfDay(query.endDate),
            },
          }),
      };

      // Add search conditions if search exists
      if (query.search) {
        whereConditions.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { company_name: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
          { phone: { contains: query.search, mode: 'insensitive' } },
        ];
      }

      // Add boolean filters with proper conversion
      if (query.is_confirm !== undefined) {
        whereConditions.is_confirm = query.is_confirm == true;
      }

      if (query.is_deposit !== undefined) {
        whereConditions.is_deposit = query.is_deposit == true;
      }

      if (query.status) {
        let statusArray: string[];

        // Nếu status là string và có dạng array string (bắt đầu bằng '[')
        if (typeof query.status === 'string' && query.status.startsWith('[')) {
          statusArray = JSON.parse(query.status);
        } else {
          // Nếu là single value
          statusArray = [query.status as string];
        }

        // Thêm vào where condition
        whereConditions.status = {
          in: statusArray,
        };
      }

      // Add numeric ID filters with type checking
      const numericFilters = [
        { field: 'branch_id', value: query.branch_id },
        { field: 'user_id', value: query.user_id },
        { field: 'stage_id', value: query.stage_id },
        { field: 'party_type_id', value: query.party_type_id },
      ];

      numericFilters.forEach(({ field, value }) => {
        if (value) {
          whereConditions[field] = parseInt(String(value), 10);
        }
      });

      // Add booking details conditions
      if (query.decor_id || query.deposit_id || query.menu_id) {
        whereConditions.booking_details = {
          some: {
            ...(query.decor_id && {
              decor_id: parseInt(String(query.decor_id), 10),
            }),
            ...(query.deposit_id && {
              deposit_id: parseInt(String(query.deposit_id), 10),
            }),
            ...(query.menu_id && {
              menu_id: parseInt(String(query.menu_id), 10),
            }),
          },
        };
      }

      // Price range filters
      if (query.minPrice || query.maxPrice) {
        whereConditions.booking_details = {
          ...whereConditions.booking_details,
          some: {
            ...whereConditions.booking_details?.some,
            total_amount: {
              ...(query.minPrice && { gte: parseFloat(query.minPrice) }),
              ...(query.maxPrice && { lte: parseFloat(query.maxPrice) }),
            },
          },
        };
      }

      // Define include structure with proper typing
      const include = {
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
        party_types: true,
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
      };

      // Execute database queries in transaction
      const [bookings, total] = await this.prismaService.$transaction([
        this.prismaService.bookings.findMany({
          where: whereConditions,
          include,
          orderBy: { created_at: 'desc' },
          skip,
          take: itemsPerPage,
        }),
        this.prismaService.bookings.count({
          where: whereConditions,
        }),
      ]);

      // Handle price sorting
      const priceSortedBookings = query.priceSort
        ? this.sortBookingsByPrice(bookings, query.priceSort)
        : bookings;

      // Calculate pagination
      const lastPage = Math.ceil(total / itemsPerPage);
      const pagination = {
        nextPage: page + 1 > lastPage ? null : page + 1,
        prevPage: page - 1 <= 0 ? null : page - 1,
        lastPage,
        itemsPerPage,
        currentPage: page,
        total,
      };

      return {
        data: FormatReturnData(priceSortedBookings, []),
        pagination,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ booking.service.ts -> findAll: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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
          party_types: true,
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Get Booking For Next 2 Weeks to 5 Weeks
  async getBookingForNext14Days(branch_id: number) {
    try {
      // Lấy tất cả các sảnh có sẵn
      const allStages = await this.prismaService.stages.findMany({
        where: { branch_id: Number(branch_id) },
        select: {
          id: true,
          name: true,
        },
      });

      const currentDate = new Date();
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() + 14);
      endDate.setDate(currentDate.getDate() + 35);

      // Lấy tất cả bookings trong khoảng thời gian
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          branch_id: Number(branch_id),
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
          stage_id: true,
        },
      });

      // Tạo Map để tra cứu booking nhanh hơn
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

          // Tạo danh sách stages với status
          const stagesWithStatus = allStages.map((stage) => ({
            id: stage.id,
            name: stage.name,
            status: existingBooking
              ? existingBooking.stage_id === stage.id
              : false,
          }));

          response.push({
            id: existingBooking?.id || null,
            name: existingBooking?.name || null,
            organization_date: `${date}-${month}-${year}`,
            shift: shift,
            status: !!existingBooking,
            stages: stagesWithStatus,
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Update Status Booking
  async updateStatus(
    id: number,
    updateStatusBookingDto: UpdateStatusBookingDto,
  ) {
    try {
      const { is_confirm, is_deposit, status } = updateStatusBookingDto;

      // Find booking first to avoid duplicate queries
      const findBooking = await this.prismaService.bookings.findUnique({
        where: { id: Number(id) },
      });

      if (!findBooking) {
        throw new NotFoundException('Không tìm thấy đơn đặt tiệc');
      }

      // Update membership if status is success
      if (status === BookingStatus.SUCCESS) {
        await this.updateMembershipBooking(findBooking.user_id);
      }

      // Update booking status
      await this.prismaService.bookings.update({
        where: { id: Number(id) },
        data: {
          is_confirm: String(is_confirm) === 'true' ? true : false,
          is_deposit: String(is_deposit) === 'true' ? true : false,
          status: status as BookingStatus,
        },
      });

      // Send notification
      await this.sendBookingNotification(
        findBooking.name,
        findBooking.branch_id,
        status as BookingStatus,
        is_confirm,
        is_deposit,
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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
        spare_table_count,
        phone,
        other_service,
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

      // Status = true =? Check Rank User
      if (status === BookingStatus.SUCCESS) {
        this.updateMembershipBooking(findBooking.user_id);
      }

      let gift = [];
      if (user_id) {
        const findUser = await this.prismaService.users.findUnique({
          where: { id: Number(user_id) },
          include: {
            memberships: {
              select: {
                gifts: true,
              },
            },
          },
        });

        if (findUser) {
          gift = findUser.memberships.gifts;
        }
      }

      // ? Nếu mà ngày tổ chức chỉ còn 3 ngày nữa là tổ chức thì sẽ không cho sửa
      if (reqUser.role == 'user') {
        const currentDate = new Date();
        const organizationDate = new Date(findBooking.organization_date);

        // Sử dụng getTime() để lấy timestamp trước khi trừ
        const daysUntilEvent = Math.ceil(
          (organizationDate.getTime() - currentDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        if (daysUntilEvent <= 3) {
          throw new BadRequestException(
            'Không thể sửa thông tin đơn đặt tiệc khi còn 3 ngày nữa là tổ chức',
          );
        }
      }

      // ! Update Booking
      await this.prismaService.bookings.update({
        where: { id: Number(id) },
        data: {
          user_id: user_id
            ? Number(user_id)
            : findBooking.user_id
              ? Number(findBooking.user_id)
              : null,
          branch_id: Number(branch_id),
          name,
          phone,
          company_name: company_name ? company_name : null,
          email,
          note,
          number_of_guests: Number(number_of_guests),
          is_confirm: String(is_confirm) === 'true' ? true : false,
          is_deposit: String(is_deposit) === 'true' ? true : false,
          party_type_id: Number(party_type_id),
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

      if (!findBooking.is_confirm) {
        throw new BadRequestException(
          'Không thể sửa thông tin đơn đặt tiệc khi chưa xác nhận',
        );
      }

      // Fetching user, branch,  stage, decor, and menu in parallel
      const [branch, stage, decor, menu, party_types] = await Promise.all([
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
      ]);
      // Validate fetched data
      const validateExists = (entity: any, name: string) => {
        if (!entity) throw new NotFoundException(`Không tìm thấy ${name}`);
      };
      validateExists(branch, 'branch');
      validateExists(stage, 'stage');
      validateExists(decor, 'decor');
      validateExists(menu, 'menu');
      // ? Calculate accessory amounts
      let tableAmount = Number(table_count) * 200000;
      let spareTableAmount = Number(spare_table_count) * 200000;
      let chair_count = Number(table_count) * 10;
      let spare_chair_count = Number(spare_table_count) * 10;
      let chairAmount = chair_count * 50000;
      let spareChairAmount = spare_chair_count * 50000;
      let totalMenuAmount = Number(menu.price) * Number(table_count);

      if (Number(table_count) > Number(findStages.capacity_max)) {
        throw new BadRequestException(
          'Số lượng bàn vượt quá sức chứa của sảnh',
        );
      }

      if (Number(table_count) < Number(findStages.capacity_min)) {
        throw new BadRequestException(
          'Số lượng bàn quá ít so với sức chứa tối thiểu của sảnh',
        );
      }

      // ? Orther Service
      let otherServiceAmount = 0;
      // ! Fetch booking with relations
      if (other_service) {
        const jsonString = other_service
          .replace(/;/g, ',')
          .replace(/\s+/g, '')
          .replace(/([{,])(\w+):/g, '$1"$2":');
        const serviceArray = JSON.parse(jsonString);

        await Promise.all(
          serviceArray.map(async (orther) => {
            const findOther = await this.prismaService.products.findUnique({
              where: { id: Number(orther.id) },
            });

            if (!findOther)
              throw new HttpException(
                'Không tìm thấy dịch vụ thêm',
                HttpStatus.NOT_FOUND,
              );

            otherServiceAmount +=
              Number(findOther.price) * Number(orther.quantity);
            orther.name = findOther.name;
            orther.amount = Number(findOther.price);
            orther.total_price =
              Number(findOther.price) * Number(orther.quantity);
            orther.description = findOther.description;
            orther.short_description = findOther.short_description;
            orther.images = findOther.images;
            orther.quantity = Number(orther.quantity);
          }),
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
      let {
        created_at: createdAtMenu,
        updated_at: updatedAtMenu,
        ...menuFormat
      } = menu;
      (menuFormat as any).total_amount = totalMenuAmount;
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

        if (extra_service) {
          const jsonString = extra_service
            .replace(/;/g, ',')
            .replace(/\s+/g, '')
            .replace(/([{,])(\w+):/g, '$1"$2":');
          const serviceArray = JSON.parse(jsonString);

          await Promise.all(
            serviceArray.map(async (extra) => {
              const findOther = await this.prismaService.products.findUnique({
                where: { id: Number(extra.id) },
              });

              if (!findOther)
                throw new HttpException(
                  'Không tìm thấy dịch vụ thêm',
                  HttpStatus.NOT_FOUND,
                );
              extraServiceAmount +=
                Number(findOther.price) * Number(extra.quantity);
              extra.name = findOther.name;
              extra.amount = Number(findOther.price);
              extra.total_price =
                Number(findOther.price) * Number(extra.quantity);
              extra.description = findOther.description;
              extra.short_description = findOther.short_description;
              extra.images = findOther.images;
              extra.quantity = Number(extra.quantity);
            }),
          );
        }
        // Total calculation
        const totalAmount = Number(
          Number(decor.price) +
            Number(totalMenuAmount) +
            Number(stage.price) +
            Number(party_types.price) +
            Number(tableAmount) +
            Number(chairAmount) +
            Number(spareChairAmount) +
            Number(spareTableAmount) +
            Number(otherServiceAmount) +
            Number(extraServiceAmount),
        );
        if (Number(amount) !== totalAmount) {
          throw new HttpException(
            `Lỗi tính toán, tổng tiền phải là ${totalAmount}`,
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
            decor_detail: decorFormat,
            menu_detail: menuFormat,
            party_type_detail: partyTypeFormat,
            stage_detail: stageFormat,
            table_count: Number(table_count),
            chair_count: Number(chair_count),
            spare_chair_count: spare_table_count
              ? Number(spare_chair_count)
              : 0,
            spare_chair_price: spare_table_count ? Number(spareChairAmount) : 0,
            spare_table_count: spare_table_count
              ? Number(spare_table_count)
              : 0,
            spare_table_price: spare_table_count ? Number(spareTableAmount) : 0,
            extra_service: extra_service,
            gift,
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
            Number(totalMenuAmount) +
            Number(stage.price) +
            Number(party_types.price) +
            Number(tableAmount) +
            Number(chairAmount) +
            Number(spareChairAmount) +
            Number(spareTableAmount) +
            Number(otherServiceAmount),
        );

        if (Number(amount) !== totalAmount) {
          throw new HttpException(
            `Lỗi tính toán, tổng tiền phải là ${totalAmount}`,
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
            name: `Tiền cọc tiệc của ${findBooking.name}`,
            phone: findBooking.phone,
            email: findBooking.email,
            payment_method: null,
            amount: Number(depositAmount),
          },
        });

        // ! Create Or Update Booking
        const findBookingDetail =
          await this.prismaService.booking_details.findFirst({
            where: { booking_id: Number(id) },
          });

        if (findBookingDetail) {
          const oldDepositId = findBookingDetail.deposit_id;
          await this.prismaService.booking_details.update({
            where: { booking_id: Number(findBooking.id) },
            data: {
              decor_id: Number(decor_id),
              menu_id: Number(menu_id),
              decor_detail: decorFormat,
              menu_detail: menuFormat,
              party_type_detail: partyTypeFormat,
              stage_detail: stageFormat,
              extra_service: extra_service ? extra_service : null,
              gift,
              table_count: Number(table_count),
              chair_count: Number(chair_count),
              spare_chair_count: spare_table_count
                ? Number(spare_chair_count)
                : 0,
              spare_chair_price: spare_table_count
                ? Number(spareChairAmount)
                : 0,
              spare_table_count: spare_table_count
                ? Number(spare_table_count)
                : 0,
              spare_table_price: spare_table_count
                ? Number(spareTableAmount)
                : 0,
              fee,
              total_amount: totalAmount,
              deposit_id: deposit.id,
              amount_booking: Number(bookingAmount),
            },
          });
          //? Delete Old Deposit
          await this.prismaService.deposits.delete({
            where: { id: Number(oldDepositId) },
          });
        } else {
          await this.prismaService.booking_details.create({
            data: {
              booking_id: Number(findBooking.id),
              decor_id: Number(decor_id),
              menu_id: Number(menu_id),
              decor_detail: decorFormat,
              menu_detail: menuFormat,
              party_type_detail: partyTypeFormat,
              stage_detail: stageFormat,
              extra_service: extra_service ? extra_service : null,
              gift,
              fee,
              table_count: Number(table_count),
              chair_count: Number(chair_count),
              spare_chair_count: spare_table_count
                ? Number(spare_chair_count)
                : 0,
              spare_chair_price: spare_table_count
                ? Number(spareChairAmount)
                : 0,
              spare_table_count: spare_table_count
                ? Number(spare_table_count)
                : 0,
              spare_table_price: spare_table_count
                ? Number(spareTableAmount)
                : 0,
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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

      if (findBooking.deleted === false) {
        throw new HttpException(
          'Đơn tiệc chưa được xóa tạm thời, không thể khôi phục!',
          HttpStatus.BAD_REQUEST,
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
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

      if (booking.deleted === false) {
        throw new HttpException(
          'Đơn tiệc chưa được xóa tạm thời, không thể xóa vĩnh viễn!',
          HttpStatus.BAD_REQUEST,
        );
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error,
      });
    }
  }

  // ! Update Membership Booking
  private async updateMembershipBooking(userId: number) {
    try {
      // First get all confirmed bookings and calculate total amount
      const bookings = await this.prismaService.bookings.findMany({
        where: {
          user_id: Number(userId),
          is_confirm: true,
          is_deposit: true,
          status: 'success',
          deleted: false,
        },
        include: {
          booking_details: {
            select: {
              total_amount: true,
            },
          },
        },
      });

      // Calculate total amount from all booking details
      const totalAmount = bookings.reduce((sum, booking) => {
        const bookingTotal = booking.booking_details.reduce(
          (detailSum, detail) => {
            return detailSum + Number(detail.total_amount);
          },
          0,
        );
        return sum + bookingTotal;
      }, 0);

      if (totalAmount === 0) {
        return;
      }

      // Find eligible membership based on total amount
      const eligibleMembership = await this.prismaService.memberships.findFirst(
        {
          where: {
            deleted: false,
            booking_total_amount: {
              lte: totalAmount,
            },
          },
          orderBy: {
            booking_total_amount: 'desc',
          },
          select: {
            id: true,
          },
        },
      );

      if (eligibleMembership) {
        // Update user membership
        await this.prismaService.users.update({
          where: {
            id: userId,
          },
          data: {
            memberships_id: eligibleMembership.id,
          },
        });
      }
    } catch (error) {
      // Add proper error logging here
      throw new Error(`Failed to update membership booking: ${error.message}`);
    }
  }

  // ? Sort Booking By Price
  private sortBookingsByPrice(bookings: any[], sortDirection: string): any[] {
    return [...bookings].sort((a, b) => {
      const getTotalAmount = (booking: any) =>
        booking.booking_details.reduce(
          (sum: number, detail: any) => sum + (detail.total_amount || 0),
          0,
        );

      const comparison = getTotalAmount(a) - getTotalAmount(b);
      return sortDirection.toLowerCase() === 'asc' ? comparison : -comparison;
    });
  }

  // ? Help Send Notification
  private async sendBookingNotification(
    bookingName: string,
    branchId: number,
    status: BookingStatus,
    isConfirm?: boolean,
    isDeposit?: boolean,
  ) {
    const contents = {
      name: `Đơn đặt tiệc của ${bookingName}`,
      contents: '',
      type: TypeNotifyEnum.BOOKING_UPDATED,
      branch_id: branchId,
    };

    if (isConfirm) {
      contents.contents = `Đơn đặt tiệc của ${bookingName} đã được xác nhận!`;
      contents.type = TypeNotifyEnum.BOOKING_CONFIRM;
    } else if (isDeposit) {
      contents.contents = `Đơn đặt tiệc của ${bookingName} đã được đặt cọc!`;
    } else {
      switch (status) {
        case BookingStatus.CANCEL:
          contents.contents = `Đơn đặt tiệc của ${bookingName} đã bị hủy!`;
          contents.type = TypeNotifyEnum.BOOKING_CANCEL;
          break;
        case BookingStatus.PROCESSING:
          contents.contents = `Đơn đặt tiệc của ${bookingName} đang được tổ chức!`;
          break;
        case BookingStatus.SUCCESS:
          contents.contents = `Đơn đặt tiệc của ${bookingName} đã được tiến hành!`;
          contents.type = TypeNotifyEnum.BOOKING_SUCCESS;
          break;
        default:
          contents.contents = `Đơn đặt tiệc của ${bookingName} đã cập nhật!`;
      }
    }

    await this.notificationService.sendNotifications(
      contents.name,
      contents.contents,
      contents.branch_id,
      contents.type,
    );
  }
}
