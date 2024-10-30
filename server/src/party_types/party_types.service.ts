import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FilterDto } from 'helper/dto/Filter.dto';
import { FormatReturnData } from 'helper/FormatReturnData';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import {
  CreatePartyTypeDto,
  ImagePartyTypesDto,
} from './dto/create-party_type.dto';
import { UpdatePartyTypeDto } from './dto/update-party_type.dto';

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
    const { name, description, short_description, products, price } =
      createPartyTypeDto;
    try {
      // Kiểm tra hình ảnh
      if (!files.images) {
        throw new BadRequestException('Hình ảnh không được để trống');
      }

      // Kiểm tra tên loại tiệc
      const existingPartyType = await this.prismaService.party_types.findFirst({
        where: { name },
      });
      if (existingPartyType) {
        throw new BadRequestException('Tên loại tiệc đã tồn tại');
      }

      // Kiểm tra sản phẩm
      const foundProducts = await this.prismaService.products.findMany({
        where: { id: { in: products } },
      });
      if (foundProducts.length !== products.length) {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }

      // Kiểm tra giá
      const totalProductPrice = foundProducts.reduce(
        (total, product) => total + product.price,
        0,
      );
      if (totalProductPrice !== price) {
        throw new BadRequestException('Giá loại tiệc không chính xác');
      }

      // Tải hình ảnh lên Cloudinary
      const images = await this.cloudinaryService.uploadMultipleFilesToFolder(
        files.images as any,
        'joiepalace/party',
      );

      // Tạo loại tiệc
      const partyType = await this.prismaService.party_types.create({
        data: {
          name,
          description,
          price: Number(totalProductPrice),
          short_description,
          images: images as any,
          products: {
            connect: foundProducts.map((product) => ({
              id: Number(product.id),
            })),
          },
        },
        include: {
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      throw new HttpException(
        {
          message: 'Tạo loại tiệc thành công',
          data: FormatReturnData(partyType, []),
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ partyTypesService -> create: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get all party types
  async findAll(query: FilterDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;

    try {
      // ? Where Conditions
      const whereConditions: any = {
        deleted: false,
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
        ];
      }

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.party_types.findMany({
          where: whereConditions,
          include: {
            products: {
              include: {
                tags: true,
              },
            },
          },
          skip,
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.party_types.count({
          where: whereConditions,
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 <= 0 ? null : page - 1;

      throw new HttpException(
        {
          data: FormatReturnData(res, []),
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get all party types deleted
  async findAllDeleted(query: FilterDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;

    try {
      // ? Where Conditions
      const whereConditions: any = {
        deleted: true,
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
        ];
      }

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.party_types.findMany({
          where: whereConditions,
          include: {
            products: {
              include: {
                tags: true,
              },
            },
          },
          skip,
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.party_types.count({
          where: whereConditions,
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 <= 0 ? null : page - 1;

      throw new HttpException(
        {
          data: FormatReturnData(res, []),
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get party type by id
  async findOne(id: number) {
    try {
      const partyType = await this.prismaService.party_types.findUnique({
        where: { id: Number(id) },
        include: {
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      if (!partyType) {
        throw new NotFoundException('Không tìm thấy loại tiệc');
      }

      throw new HttpException(
        {
          message: 'Lấy loại tiệc thành công',
          data: FormatReturnData(partyType, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ partyTypesService -> findOne: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Update party type
  async update(
    id: number,
    updatePartyTypeDto: UpdatePartyTypeDto,
    files: ImagePartyTypesDto,
  ) {
    const { name, description, short_description, price, products } =
      updatePartyTypeDto;
    try {
      // Tìm loại tiệc
      const partyType = await this.prismaService.party_types.findUnique({
        where: { id: Number(id) },
      });

      if (!partyType) {
        throw new NotFoundException('Không tìm thấy loại tiệc');
      }

      // Kiểm tra tên loại tiệc
      const existingPartyType = await this.prismaService.party_types.findFirst({
        where: {
          name,
          NOT: { id: Number(id) },
        },
      });

      if (existingPartyType) {
        throw new BadRequestException('Tên loại tiệc đã tồn tại');
      }

      // Kiểm tra sản phẩm
      const foundProducts = await this.prismaService.products.findMany({
        where: { id: { in: products } },
      });

      if (foundProducts.length !== products.length) {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }

      // Tính toán giá
      const totalProductPrice = foundProducts.reduce(
        (total, product) => total + product.price,
        0,
      );

      if (Number(totalProductPrice) !== Number(price)) {
        throw new BadRequestException('Giá loại tiệc không chính xác');
      }

      // Tạo đối tượng cập nhật
      const dataUpdate: any = {
        name,
        description,
        short_description,
        price: Number(totalProductPrice),
        products: {
          set: foundProducts.map((product) => ({
            id: Number(product.id),
          })),
        },
      };

      // Xử lý hình ảnh
      if (files.images) {
        const images = await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images as any,
          'joiepalace/party',
        );
        if (!images) {
          throw new BadRequestException('Upload hình ảnh thất bại');
        }
        // Xóa hình ảnh cũ
        await this.cloudinaryService.deleteMultipleImagesByUrl(
          partyType.images,
        );
        dataUpdate.images = images as any;
      }

      // Cập nhật loại tiệc
      const updatedPartyType = await this.prismaService.party_types.update({
        where: { id: Number(id) },
        data: dataUpdate,
        include: {
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      throw new HttpException(
        {
          message: 'Cập nhật loại tiệc thành công',
          data: FormatReturnData(updatedPartyType, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ partyTypesService -> update: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Remove party type
  async remove(reqUser, id: number) {
    try {
      const partyType = await this.prismaService.party_types.findUnique({
        where: { id: Number(id) },
      });

      if (!partyType) {
        throw new NotFoundException('Không tìm thấy loại tiệc');
      }

      await this.prismaService.party_types.update({
        where: { id: Number(id) },
        data: {
          deleted: true,
          deleted_by: reqUser.id,
          deleted_at: new Date(),
        },
      });

      throw new HttpException(
        { message: 'Xóa loại tiệc thành công' },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ partyTypesService -> remove: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Restore party type
  async restore(id: number) {
    try {
      const partyType = await this.prismaService.party_types.findUnique({
        where: { id: Number(id) },
      });

      if (!partyType) {
        throw new NotFoundException('Không tìm thấy loại tiệc');
      }

      await this.prismaService.party_types.update({
        where: { id: Number(id) },
        data: {
          deleted: false,
          deleted_by: null,
          deleted_at: null,
        },
      });

      throw new HttpException(
        { message: 'Khôi phục loại tiệc thành công' },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ partyTypesService -> restore: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Hard delete party type
  async destroy(id: number) {
    try {
      const partyType = await this.prismaService.party_types.findUnique({
        where: { id: Number(id) },
      });

      if (!partyType) {
        throw new NotFoundException('Không tìm thấy loại tiệc');
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }
}
