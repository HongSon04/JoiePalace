import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  }

  // ! Get All Staff
  async getAllStaff(query: any): Promise<StaffEntities[] | any> {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const skip = Number((page - 1) * itemsPerPage);
    const search = query.search || '';

    const staffs = await this.prismaService.staffs.findMany({
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
    });

    const total = staffs.length;

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
  }

  // ! Get All Staff Deleted
  async getAllStaffDeleted(query: any): Promise<StaffEntities[] | any> {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const skip = Number((page - 1) * itemsPerPage);
    const search = query.search || '';

    const staffs = await this.prismaService.staffs.findMany({
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
    });
    const total = staffs.length;

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
  }

  // ! Get Staff By Id
  async getStaffById(query: any): Promise<StaffEntities | any> {
    const { id } = query;
    const staff = await this.prismaService.staffs.findUnique({
      where: { id: Number(id) },
      include: {
        locations: true,
      },
    });
    if (!staff) {
      throw new HttpException('Nhân viên không tồn tại', HttpStatus.NOT_FOUND);
    }
    throw new HttpException({ data: staff }, HttpStatus.OK);
  }

  // ! Update Staff
  async updateStaff(
    staff_id: number,
    body: UpdateStaffDto,
  ): Promise<StaffEntities | any> {
    const { location_id, name, phone, payment_info, shift } = body;
    const checkStaff = await this.prismaService.staffs.findUnique({
      where: { id: Number(staff_id) },
    });
    if (!checkStaff) {
      throw new HttpException('Nhân viên không tồn tại', HttpStatus.NOT_FOUND);
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
  }

  // ! Update Avatar
  async updateAvatar(
    staff_id: number,
    body: UpdateAvatarStaffDto,
  ): Promise<StaffEntities | any> {
    const { avatar } = body;
    const checkStaff = await this.prismaService.staffs.findUnique({
      where: { id: Number(staff_id) },
    });
    if (!checkStaff) {
      throw new HttpException('Nhân viên không tồn tại', HttpStatus.NOT_FOUND);
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
  }

  // ! Delete Staff
  async deleteStaff(reqUser, query: any): Promise<StaffEntities | any> {
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
  }

  // ! Restore Staff
  async restoreStaff(query: any): Promise<StaffEntities | any> {
    const { id } = query;
    const checkStaff = await this.prismaService.staffs.findUnique({
      where: { id: Number(id) },
    });
    if (!checkStaff) {
      throw new HttpException('Nhân viên không tồn tại', HttpStatus.NOT_FOUND);
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
  }

  // ! Hard Delete Staff
  async hardDeleteStaff(query: any): Promise<StaffEntities | any> {
    const { id } = query;
    const checkStaff = await this.prismaService.staffs.findUnique({
      where: { id: Number(id) },
    });
    if (!checkStaff) {
      throw new HttpException('Nhân viên không tồn tại', HttpStatus.NOT_FOUND);
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
  }
}
