import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreatePartyTypeDto,
  ImagePartyTypesDto,
} from './dto/create-party_type.dto';
import { UpdatePartyTypeDto } from './dto/update-party_type.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { MakeSlugger } from 'helper/slug';
import { FilterDto } from 'helper/dto/Filter.dto';

@Injectable()
export class PartyTypesService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create party type
  async create(
    createPartyTypeDto: CreatePartyTypeDto,
    files: ImagePartyTypesDto,
  ) {
    const { name, description, short_description } = createPartyTypeDto;
    try {
      if (!files.images) {
        throw new HttpException(
          'Hình ảnh không được để trống',
          HttpStatus.BAD_REQUEST,
        );
      }

      const findPartyByName = await this.prismaService.party_types.findFirst({
        where: {
          name,
        },
      });

      if (findPartyByName) {
        throw new HttpException(
          'Tên loại tiệc đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      const images = await this.cloudinaryService.uploadMultipleFilesToFolder(
        files.images as any,
        'joieplace/party',
      );
      const slug = MakeSlugger(name);
      const partyType = await this.prismaService.party_types.create({
        data: {
          name,
          slug,
          description,
          short_description,
          images: images as any,
        },
      });

      throw new HttpException(
        { message: 'Tạo loại tiệc thành công', data: partyType },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ partyTypesService -> create: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get all party types
  async findAll(query: FilterDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;

    try {
      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.party_types.findMany({
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
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                short_description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          },
          skip,
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.party_types.count({
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
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                short_description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          },
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 <= 0 ? null : page - 1;

      throw new HttpException(
        {
          data: res,
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
      console.log('Lỗi từ partyTypesService -> findAll: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get all party types deleted
  async findAllDeleted(query: FilterDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;

    try {
      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.party_types.findMany({
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
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                short_description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          },
          skip,
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.party_types.count({
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
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                short_description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          },
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 <= 0 ? null : page - 1;

      throw new HttpException(
        {
          data: res,
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
      console.log('Lỗi từ partyTypesService -> findAll: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get party type by id
  async findOne(id: number) {
    try {
      const partyType = await this.prismaService.party_types.findUnique({
        where: { id: Number(id) },
      });

      if (!partyType) {
        throw new HttpException(
          'Không tìm thấy loại tiệc',
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(partyType, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ partyTypesService -> findOne: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get party type by slug
  async findBySlug(slug: string) {
    try {
      const partyType = await this.prismaService.party_types.findFirst({
        where: { slug },
      });

      if (!partyType) {
        throw new HttpException(
          'Không tìm thấy loại tiệc',
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(partyType, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ partyTypesService -> findBySlug: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Update party type
  async update(
    id: number,
    updatePartyTypeDto: UpdatePartyTypeDto,
    files: ImagePartyTypesDto,
  ) {
    const { name, description, short_description } = updatePartyTypeDto;
    try {
      const partyType = await this.prismaService.party_types.findUnique({
        where: { id: Number(id) },
      });

      if (!partyType) {
        throw new HttpException(
          'Không tìm thấy loại tiệc',
          HttpStatus.NOT_FOUND,
        );
      }

      const findPartyByName = await this.prismaService.party_types.findFirst({
        where: {
          name,
          NOT: {
            id,
          },
        },
      });

      if (findPartyByName) {
        throw new HttpException(
          'Tên loại tiệc đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      const dataUpdate: any = {
        name,
        description,
        short_description,
      };

      if (files.images) {
        const images = await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images as any,
          'joieplace/party',
        );
        if (!images) {
          throw new HttpException(
            'Upload hình ảnh thất bại',
            HttpStatus.BAD_REQUEST,
          );
        }
        // Remove old images
        await this.cloudinaryService.deleteMultipleImagesByUrl(
          partyType.images,
        );
        dataUpdate.images = images as any;
      }

      const updatedPartyType = await this.prismaService.party_types.update({
        where: { id: Number(id) },
        data: dataUpdate,
      });

      throw new HttpException(
        { message: 'Cập nhật loại tiệc thành công', data: updatedPartyType },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ partyTypesService -> update: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Remove party type
  async remove(reqUser, id: number) {
    try {
      const partyType = await this.prismaService.party_types.findUnique({
        where: { id: Number(id) },
      });

      if (!partyType) {
        throw new HttpException(
          'Không tìm thấy loại tiệc',
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedPartyType = await this.prismaService.party_types.update({
        where: { id: Number(id) },
        data: {
          deleted: true,
          deleted_by: reqUser.id,
          deleted_at: new Date(),
        },
      });

      throw new HttpException(
        { message: 'Xóa loại tiệc thành công', data: updatedPartyType },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ partyTypesService -> remove: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Restore party type
  async restore(id: number) {
    try {
      const partyType = await this.prismaService.party_types.findUnique({
        where: { id: Number(id) },
      });

      if (!partyType) {
        throw new HttpException(
          'Không tìm thấy loại tiệc',
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedPartyType = await this.prismaService.party_types.update({
        where: { id: Number(id) },
        data: {
          deleted: false,
          deleted_by: null,
          deleted_at: null,
        },
      });

      throw new HttpException(
        { message: 'Khôi phục loại tiệc thành công', data: updatedPartyType },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ partyTypesService -> restore: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Hard delete party type
  async destroy(id: number) {
    try {
      const partyType = await this.prismaService.party_types.findUnique({
        where: { id: Number(id) },
      });

      if (!partyType) {
        throw new HttpException(
          'Không tìm thấy loại tiệc',
          HttpStatus.NOT_FOUND,
        );
      }

      // Remove images
      await this.cloudinaryService.deleteMultipleImagesByUrl(partyType.images);
      // Remove party type
      await this.prismaService.party_types.delete({
        where: { id: Number(id) },
      });

      throw new HttpException(
        'Xóa vĩnh viễn loại tiệc thành công',
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ partyTypesService -> hardDelete: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }
}
