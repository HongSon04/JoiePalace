import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MakeSlugger } from 'helper/slug';
import { FormatReturnData } from 'helper/FormatReturnData';
import { find } from 'rxjs';

@Injectable()
export class MembershipsService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create membership
  async create(
    createMembershipDto: CreateMembershipDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const { name, description, gifts, booking_total_amount } =
        createMembershipDto;
      const slug = MakeSlugger(name);

      if (files.images.length === 0) {
        throw new BadRequestException('Ảnh không được để trống');
      }

      const findMembership = await this.prismaService.memberships.findFirst({
        where: {
          OR: [{ name }, { slug }],
        },
      });

      if (findMembership) {
        throw new NotFoundException('Tên hạng thành viên đã tồn tại');
      }

      // ? Find many products in gift
      const findManyProducts = await this.prismaService.products.findMany({
        where: {
          id: {
            in: gifts,
          },
        },
      });

      if (findManyProducts.length !== gifts.length) {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }

      const images =
        files.images && files.images.length > 0
          ? await this.cloudinaryService.uploadMultipleFilesToFolder(
              files.images,
              'joiepalace/categories',
            )
          : ([] as any);

      if (files.images && files.images.length > 0 && !images) {
        throw new BadRequestException('Upload ảnh thất bại');
      }

      const newMembership = await this.prismaService.memberships.create({
        data: {
          name,
          slug,
          description,
          gifts: {
            connect: gifts.map((id) => ({ id })),
          },
          booking_total_amount,
          images: images,
        },
      });

      throw new HttpException(
        {
          message: 'Tạo hạng thành viên thành công',
          data: newMembership,
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ memberships.service.ts -> create', error);
      throw new InternalServerErrorException(
        'Lỗi server vui lòng thử lại',
        error,
      );
    }
  }

  // ! Get all memberships
  async findAll() {
    try {
      const memberships = await this.prismaService.memberships.findMany({
        where: {
          deleted: false,
        },
        include: {
          gifts: true,
        },
      });

      throw new HttpException(
        {
          message: 'Lấy danh sách hạng thành viên thành công',
          data: FormatReturnData(memberships, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ memberships.service.ts -> findAll', error);
      throw new InternalServerErrorException(
        'Lỗi server vui lòng thử lại',
        error,
      );
    }
  }

  // ! Get all memberships with deleted
  async findAllDeleted() {
    try {
      const memberships = await this.prismaService.memberships.findMany({
        where: {
          deleted: true,
        },
        include: {
          gifts: true,
        },
      });

      throw new HttpException(
        {
          message: 'Lấy danh sách hạng thành viên xóa tạm thành công',
          data: FormatReturnData(memberships, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ memberships.service.ts -> findAllWithDeleted', error);
      throw new InternalServerErrorException(
        'Lỗi server vui lòng thử lại',
        error,
      );
    }
  }
  
  // ! Get membership by id
  async findOne(id: number) {
    try {
      const membership = await this.prismaService.memberships.findUnique({
        where: {
          id,
        },
        include: {
          gifts: true,
        },
      });

      if (!membership) {
        throw new NotFoundException('Hạng thành viên không tồn tại');
      }

      throw new HttpException(
        {
          message: 'Lấy hạng thành viên thành công',
          data: FormatReturnData(membership, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ memberships.service.ts -> findOne', error);
      throw new InternalServerErrorException(
        'Lỗi server vui lòng thử lại',
        error,
      );
    }
  }

  // ! Get membership by slug
  async findOneBySlug(slug: string) {
    try {
      const membership = await this.prismaService.memberships.findUnique({
        where: {
          slug,
        },
        include: {
          gifts: true,
        },
      });

      if (!membership) {
        throw new NotFoundException('Hạng thành viên không tồn tại');
      }

      throw new HttpException(
        {
          message: 'Lấy hạng thành viên thành công',
          data: FormatReturnData(membership, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ memberships.service.ts -> findOneBySlug', error);
      throw new InternalServerErrorException(
        'Lỗi server vui lòng thử lại',
        error,
      );
    }
  }

  // ! Update membership
  async update(
    id: number,
    updateMembershipDto: UpdateMembershipDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const { name, description, gifts, booking_total_amount } =
        updateMembershipDto;

      const findMembership = await this.prismaService.memberships.findUnique({
        where: {
          id,
        },
      });

      if (!findMembership) {
        throw new NotFoundException('Hạng thành viên không tồn tại');
      }

      const slug = MakeSlugger(name);

      const findMembershipName = await this.prismaService.memberships.findFirst(
        {
          where: {
            OR: [{ name }, { slug }],
            NOT: {
              id: Number(id),
            },
          },
        },
      );

      if (findMembershipName) {
        throw new BadRequestException('Tên hạng thành viên đã tồn tại');
      }

      // ? Find many products in gift
      const findManyProducts = await this.prismaService.products.findMany({
        where: {
          id: {
            in: gifts,
          },
        },
      });

      if (findManyProducts.length !== gifts.length) {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }

      let images;

      if (files.images && files.images.length > 0) {
        images = await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/categories',
        );

        if (!images) {
          throw new BadRequestException('Upload ảnh thất bại');
        }
      }

      const updateMembership = await this.prismaService.memberships.update({
        where: {
          id,
        },
        data: {
          name,
          slug,
          description,
          gifts: {
            set: gifts.map((id) => ({ id })),
          },
          booking_total_amount,
          images: images ? images : findMembership.images,
        },
      });

      throw new HttpException(
        {
          message: 'Cập nhật hạng thành viên thành công',
          data: FormatReturnData(updateMembership, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ memberships.service.ts -> update', error);
      throw new InternalServerErrorException(
        'Lỗi server vui lòng thử lại',
        error,
      );
    }
  }

  // ! Soft delete membership
  async remove(reqUser, id: number) {
    try {
      const findMembership = await this.prismaService.memberships.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!findMembership) {
        throw new NotFoundException('Hạng thành viên không tồn tại');
      }

      await this.prismaService.memberships.update({
        where: {
          id: Number(id),
        },
        data: {
          deleted_at: new Date(),
          deleted_by: reqUser.id,
          deleted: true,
        },
      });

      throw new HttpException(
        {
          message: 'Xóa hạng thành viên tạm thời thành công',
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ memberships.service.ts -> remove', error);
      throw new InternalServerErrorException(
        'Lỗi server vui lòng thử lại',
        error,
      );
    }
  }

  // ! Restore membership
  async restore(id: number) {
    try {
      const findMembership = await this.prismaService.memberships.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!findMembership) {
        throw new NotFoundException('Hạng thành viên không tồn tại');
      }

      await this.prismaService.memberships.update({
        where: {
          id: Number(id),
        },
        data: {
          deleted_at: null,
          deleted_by: null,
          deleted: false,
        },
      });

      throw new HttpException(
        {
          message: 'Khôi phục hạng thành viên thành công',
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ memberships.service.ts -> restore', error);
      throw new InternalServerErrorException(
        'Lỗi server vui lòng thử lại',
        error,
      );
    }
  }

  // ! Hard delete membership
  async hardDelete(id: number) {
    try {
      const findMembership = await this.prismaService.memberships.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!findMembership) {
        throw new NotFoundException('Hạng thành viên không tồn tại');
      }

      if (findMembership.deleted === false) {
        throw new BadRequestException('Hạng thành viên chưa bị xóa tạm thời');
      }

      await this.prismaService.memberships.delete({
        where: {
          id: Number(id),
        },
      });

      throw new HttpException(
        {
          message: 'Xóa hạng thành viên vĩnh viễn thành công',
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ memberships.service.ts -> hardDelete', error);
      throw new InternalServerErrorException(
        'Lỗi server vui lòng thử lại',
        error,
      );
    }
  }
}