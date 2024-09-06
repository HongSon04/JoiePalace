import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { StaffEntities } from './entities/staff.entities';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateAvatarStaffDto } from './dto/update-avatar-staff.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ChangeLocationDto } from './dto/change-location.dto';

@Injectable()
export class StaffsService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Add Staff
  async addStaff(body: CreateStaffDto): Promise<StaffEntities | any> {
    try {
      const { location_id, name, phone, payment_info, shift, avatar } = body;
      const checkLocation = await this.prismaService.locations.findUnique({
        where: { id: location_id },
      });
      if (!checkLocation) {
        throw new HttpException('Địa điểm không tồn tại', HttpStatus.NOT_FOUND);
      }
      const checkStaff = await this.prismaService.staffs.findFirst({
        where: { phone },
      });
      if (checkStaff) {
        throw new HttpException(
          'Số điện thoại đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }
      const staff = await this.prismaService.staffs.create({
        data: {
          locations_id: location_id,
          name,
          phone,
          payment_info,
          shift,
          avatar,
        },
      });
      throw new HttpException(
        { message: 'Thêm nhân viên thành công', data: staff },
        201,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ staffs.service.ts -> addStaff: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get All Staff
  async getAllStaff(query: any): Promise<StaffEntities[] | any> {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const skip = Number((page - 1) * itemsPerPage);
      const search = query.search || '';

      const [staffs, total] = await this.prismaService.$transaction([
        this.prismaService.staffs.findMany({
          where: {
            OR: [
              { name: { contains: search } },
              { phone: { contains: search } },
              { locations: { name: { contains: search } } },
            ],
            deleted: false,
          },
          include: {
            locations: true,
          },
          orderBy: {
            created_at: 'desc',
          },
          skip,
          take: itemsPerPage,
        }),
        this.prismaService.staffs.count({
          where: {
            OR: [
              { name: { contains: search } },
              { phone: { contains: search } },
              { locations: { name: { contains: search } } },
            ],
            deleted: false,
          },
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const nextPage = page >= lastPage ? null : page + 1;
      const prevPage = page <= 1 ? null : page - 1;

      throw new HttpException(
        {
          data: staffs,
          pagination: {
            total,
            itemsPerPage,
            lastPage,
            nextPage,
            prevPage,
            currentPage: page,
          },
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ staffs.service.ts -> getAllStaff: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get All Staff Deleted
  async getAllStaffDeleted(query: any): Promise<StaffEntities[] | any> {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const skip = Number((page - 1) * itemsPerPage);
      const search = query.search || '';

      const [staffs, total] = await this.prismaService.$transaction([
        this.prismaService.staffs.findMany({
          where: {
            OR: [
              { name: { contains: search } },
              { phone: { contains: search } },
              { locations: { name: { contains: search } } },
            ],
            deleted: true,
          },
          include: {
            locations: true,
          },
          orderBy: {
            created_at: 'desc',
          },
          skip,
          take: itemsPerPage,
        }),
        this.prismaService.staffs.count({
          where: {
            OR: [
              { name: { contains: search } },
              { phone: { contains: search } },
              { locations: { name: { contains: search } } },
            ],
            deleted: true,
          },
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const nextPage = page >= lastPage ? null : page + 1;
      const prevPage = page <= 1 ? null : page - 1;

      throw new HttpException(
        {
          data: staffs,
          pagination: {
            total,
            itemsPerPage,
            lastPage,
            nextPage,
            prevPage,
            currentPage: page,
          },
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ staffs.service.ts -> getAllStaffDeleted: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get Staff By Id
  async getStaffById(query: any): Promise<StaffEntities | any> {
    try {
      const { id } = query;
      const staff = await this.prismaService.staffs.findUnique({
        where: { id: Number(id) },
        include: {
          locations: true,
        },
      });
      if (!staff) {
        throw new HttpException(
          'Nhân viên không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException({ data: staff }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ staffs.service.ts -> getStaffById: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Update Staff
  async updateStaff(
    staff_id: number,
    body: UpdateStaffDto,
  ): Promise<StaffEntities | any> {
    try {
      const { location_id, name, phone, payment_info, shift } = body;
      const checkStaff = await this.prismaService.staffs.findUnique({
        where: { id: Number(staff_id) },
      });
      if (!checkStaff) {
        throw new HttpException(
          'Nhân viên không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
      const checkLocation = await this.prismaService.locations.findUnique({
        where: { id: location_id },
      });
      if (!checkLocation) {
        throw new HttpException('Địa điểm không tồn tại', HttpStatus.NOT_FOUND);
      }
      const updateStaff = await this.prismaService.staffs.update({
        where: { id: Number(staff_id) },
        data: {
          locations_id: location_id,
          name,
          phone,
          payment_info,
          shift,
        },
      });
      throw new HttpException(
        { message: 'Cập nhật nhân viên thành công', data: updateStaff },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ staffs.service.ts -> updateStaff: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Update Avatar
  async updateAvatar(
    staff_id: number,
    body: UpdateAvatarStaffDto,
  ): Promise<StaffEntities | any> {
    try {
      const { avatar } = body;
      const checkStaff = await this.prismaService.staffs.findUnique({
        where: { id: Number(staff_id) },
      });
      if (!checkStaff) {
        throw new HttpException(
          'Nhân viên không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
      // Delete Image
      if (checkStaff.avatar) {
        await this.cloudinaryService.deleteImageByUrl(checkStaff.avatar);
      }
      const updateAvatar = await this.prismaService.staffs.update({
        where: { id: Number(staff_id) },
        data: {
          avatar,
        },
      });
      throw new HttpException(
        { message: 'Cập nhật ảnh đại diện thành công', data: updateAvatar },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ staffs.service.ts -> updateAvatar: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Delete Staff
  async deleteStaff(reqUser, query: any): Promise<StaffEntities | any> {
    try {
      const { id } = query;
      const checkStaff = await this.prismaService.staffs.findUnique({
        where: { id: Number(id) },
      });
      if (!checkStaff) {
        return { status: 404, message: 'Nhân viên không tồn tại' };
      }

      const deleteStaff = await this.prismaService.staffs.update({
        where: { id: Number(id) },
        data: {
          deleted: true,
          deleted_by: Number(reqUser.id),
          deleted_at: new Date(),
        },
      });
      return { message: 'Xóa nhân viên thành công', data: deleteStaff };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ staffs.service.ts -> deleteStaff: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Restore Staff
  async restoreStaff(query: any): Promise<StaffEntities | any> {
    try {
      const { id } = query;
      const checkStaff = await this.prismaService.staffs.findUnique({
        where: { id: Number(id) },
      });
      if (!checkStaff) {
        throw new HttpException(
          'Nhân viên không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
      const restoreStaff = await this.prismaService.staffs.update({
        where: { id: Number(id) },
        data: {
          deleted: false,
          deleted_by: null,
          deleted_at: null,
        },
      });
      throw new HttpException(
        { message: 'Khôi phục nhân viên thành công', data: restoreStaff },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ staffs.service.ts -> restoreStaff: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Hard Delete Staff
  async hardDeleteStaff(query: any): Promise<StaffEntities | any> {
    try {
      const { id } = query;
      const checkStaff = await this.prismaService.staffs.findUnique({
        where: { id: Number(id) },
      });
      if (!checkStaff) {
        throw new HttpException(
          'Nhân viên không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
      // Delete Image
      if (checkStaff.avatar) {
        await this.cloudinaryService.deleteImageByUrl(checkStaff.avatar);
      }
      const hardDeleteStaff = await this.prismaService.staffs.delete({
        where: { id: Number(id) },
      });
      return {
        message: 'Xóa vĩnh viễn nhân viên thành công',
        data: hardDeleteStaff,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ staffs.service.ts -> hardDeleteStaff: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }
}
