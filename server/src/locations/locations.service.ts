import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { PrismaService } from 'src/prisma.service';
import { FilterDto } from 'helper/dto/Filter.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private prismaService: PrismaService) {}

  // ! Create A New Location
  async createLocation(location: CreateLocationDto) {
    const { name, address, phone } = location;
    const createLocation = await this.prismaService.locations.create({
      data: {
        name,
        address,
        phone,
      },
    });
    const { deleted, deleted_at, deleted_by, ...data } = createLocation;
    return {
      message: 'Tạo địa điểm thành công',
      data,
    };
  }

  // ! Get All Locations
  async getAllLocations(query: FilterDto) {
    const page = Number(query.page) || 1;
    const search = query.search || '';
    const itemsPerPage = Number(query.itemsPerPage) || 1;
    const skip = (page - 1) * itemsPerPage;

    const [res, total] = await this.prismaService.$transaction([
      this.prismaService.locations.findMany({
        where: {
          deleted: false,
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              address: {
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
          ],
        },
        skip: skip,
        take: itemsPerPage,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
        },
      }),
      this.prismaService.locations.count({
        where: {
          deleted: false,
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              address: {
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
          ],
        },
      }),
    ]);

    const lastPage = Math.ceil(total / itemsPerPage);
    const nextPage = page >= lastPage ? null : page + 1;
    const prevPage = page <= 1 ? null : page - 1;

    return {
      data: res,
      pagination: {
        total: res.length,
        itemsPerPage,
        lastPage,
        nextPage,
        prevPage,
        currentPage: page,
      },
    };
  }

  // ! Get All Deleted Locations
  async getAllDeletedLocations(query: FilterDto) {
    const page = Number(query.page) || 1;
    const search = query.search || '';
    const itemsPerPage = Number(query.itemsPerPage) || 1;
    const skip = (page - 1) * itemsPerPage;

    const [res, total] = await this.prismaService.$transaction([
      this.prismaService.locations.findMany({
        where: {
          deleted: true,
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              address: {
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
          ],
        },
        skip: skip,
        take: itemsPerPage,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
        },
      }),
      this.prismaService.locations.count({
        where: {
          deleted: true,
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              address: {
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
          ],
        },
      }),
    ]);

    const lastPage = Math.ceil(total / itemsPerPage);
    const nextPage = page >= lastPage ? null : page + 1;
    const prevPage = page <= 1 ? null : page - 1;

    return {
      data: res,
      pagination: {
        total: res.length,
        itemsPerPage,
        lastPage,
        nextPage,
        prevPage,
        currentPage: page,
      },
    };
  }

  // ! Get Location By Id
  async getLocationById(id: number) {
    const location = await this.prismaService.locations.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!location) {
      return {
        message: 'Không tìm thấy địa điểm',
      };
    }
    const { deleted, deleted_at, deleted_by, ...data } = location;
    return data;
  }

  // ! Change Location Info
  async updateLocation(location: UpdateLocationDto, id: Number) {
    const { name, address, phone } = location;
    const updateLocation = await this.prismaService.locations.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        address,
        phone,
      },
    });
    const { deleted, deleted_at, deleted_by, ...data } = updateLocation;
    return {
      message: 'Cập nhật địa điểm thành công',
      data,
    };
  }

  // ! Soft Delete Location
  async softDeleteLocation(reqUser: any, id: number) {
    try {
      const location = await this.prismaService.locations.findUnique({
        where: {
          id: Number(id),
        },
      });
      console.log(reqUser.id);
      if (!location) {
        throw new HttpException(
          'Địa điểm không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.prismaService.locations.update({
        where: {
          id: Number(id),
        },
        data: {
          deleted: true,
          deleted_at: new Date(),
          deleted_by: `${reqUser.id}`,
        },
      });
      return {
        message: 'Xóa địa điểm thành công',
      };
    } catch (error) {
      throw new HttpException('Đã có lỗi xảy ra', HttpStatus.BAD_REQUEST);
    }
  }

  // ! Restore Location
  async restoreLocation(id: number) {
    try {
      const location = await this.prismaService.locations.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!location) {
        throw new HttpException(
          'Địa điểm không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.prismaService.locations.update({
        where: {
          id: Number(id),
        },
        data: {
          deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
      });
      return {
        message: 'Khôi phục địa điểm thành công',
      };
    } catch (error) {
      throw new HttpException('Đã có lỗi xảy ra', HttpStatus.BAD_REQUEST);
    }
  }

  // ! Hard Delete Location
  async hardDeleteLocation(reqUser: any, id: number) {
    try {
      const location = await this.prismaService.locations.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!location) {
        throw new HttpException(
          'Địa điểm không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.prismaService.locations.delete({
        where: {
          id: Number(id),
        },
      });
      return {
        message: 'Xóa vĩnh viễn địa điểm thành công',
      };
    } catch (error) {
      throw new HttpException('Đã có lỗi xảy ra', HttpStatus.BAD_REQUEST);
    }
  }
}
