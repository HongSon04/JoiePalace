import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { PrismaService } from 'src/prisma.service';
import { FilterDto } from 'helper/dto/Filter.dto';

@Injectable()
export class LocationsService {
  constructor(private prismaService: PrismaService) {}
  async createLocation(location: CreateLocationDto) {
    const { name, address, phone } = location;
    const createLocation = await this.prismaService.locations.create({
      data: {
        name,
        address,
        phone,
      },
    });
    return {
      message: 'Tạo địa điểm thành công',
      data: createLocation,
    };
  }

  async getAllLocations(query: FilterDto) {
    const page = Number(query.page) || 1;
    const search = query.search || '';
    const itemsPerPage = Number(query.itemsPerPage) || 10;

    const skip = (page - 1) * itemsPerPage;

    const res = await this.prismaService.locations.findMany({
      where: {
        name: {
          contains: search,
        },
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
    });

    const lastPage = Math.ceil(res.length / itemsPerPage);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 <= 0 ? null : page - 1;
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
}
