import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MakeSlugger } from 'helper/slug';
import { FormatReturnData } from 'helper/FormatReturnData';

@Injectable()
export class PackagesService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create package
  async create(
    createPackageDto: CreatePackageDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const {
        name,
        decor_id,
        menu_id,
        party_type_id,
        description,
        price,
        short_description,
        extra_sevice,
      } = createPackageDto;
      let checkPrice = 0;

      // Validate inputs
      if (!files.images || files.images.length === 0) {
        throw new BadRequestException('Ảnh không được để trống');
      }

      // Check Name & slug
      const slug = MakeSlugger(name);
      const findPackage = await this.prismaService.packages.findFirst({
        where: { OR: [{ name }, { slug }] },
      });

      if (findPackage) {
        throw new BadRequestException('Tên gói đã tồn tại');
      }

      // ? Check decor_id
      const findDecor = await this.prismaService.decors.findUnique({
        where: { id: Number(decor_id) },
      });

      if (!findDecor) {
        throw new NotFoundException('ID Trang trí không tồn tại');
      }
      checkPrice += findDecor.price;

      // ? Check menu_id
      const findMenu = await this.prismaService.menus.findUnique({
        where: { id: Number(menu_id) },
      });
      checkPrice += findMenu.price;

      if (!findMenu) {
        throw new NotFoundException('ID Menu không tồn tại');
      }

      // ? Check party_type_id
      const findPartyType = await this.prismaService.party_types.findUnique({
        where: { id: Number(party_type_id) },
      });

      if (!findPartyType) {
        throw new NotFoundException('ID Loại tiệc không tồn tại');
      }
      checkPrice += findPartyType.price;

      // ? Check Extra Service
      extra_sevice.forEach(async (service) => {
        const findService = await this.prismaService.products.findUnique({
          where: { id: Number(service.id) },
        });

        if (!findService) {
          throw new NotFoundException('ID Sản Phẩm không tồn tại');
        }
        checkPrice += findService.price * service.quantity;
      });

      // ? Check Price
      if (Number(price) !== Number(checkPrice)) {
        throw new BadRequestException('Giá không chính xác');
      }

      // Upload images
      const uploadImages =
        await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/packages',
        );

      if (!uploadImages) {
        throw new BadRequestException('Upload ảnh thất bại');
      }

      // Create Package
      const createPackage = await this.prismaService.packages.create({
        data: {
          name,
          slug,
          decor_id: Number(decor_id),
          menu_id: Number(menu_id),
          party_type_id: Number(party_type_id),
          description,
          price: Number(price),
          short_description,
          images: uploadImages as any,
          extra_service: extra_sevice,
        },
        include: {
          menus: true,
          decors: true,
          party_types: true,
        },
      });

      throw new HttpException(
        {
          message: 'Tạo gói thành công',
          data: FormatReturnData(createPackage, []),
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ packages.service.ts -> create', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại',
        error,
      );
    }
  }

  // ! Get all packages
  async findAll() {
    try {
      const packages = await this.prismaService.packages.findMany({
        where: {
          deleted: false,
        },
        include: {
          menus: true,
          decors: true,
          party_types: true,
        },
      });

      throw new HttpException(
        {
          message: 'Lấy danh sách gói thành công',
          data: FormatReturnData(packages, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ packages.service.ts -> findAll', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại',
        error,
      );
    }
  }

  // ! Get one package
  async findOne(id: number) {
    try {
      const findPackage = await this.prismaService.packages.findUnique({
        where: { id: Number(id) },
        include: {
          menus: true,
          decors: true,
          party_types: true,
        },
      });

      if (!findPackage) {
        throw new NotFoundException('Gói không tồn tại');
      }

      throw new HttpException(
        {
          message: 'Lấy gói thành công',
          data: FormatReturnData(findPackage, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ packages.service.ts -> findOne', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại',
        error,
      );
    }
  }

  // ! Get all deleted packages
  async findAllDeleted() {
    try {
      const packages = await this.prismaService.packages.findMany({
        where: {
          deleted: true,
        },
        include: {
          menus: true,
          decors: true,
          party_types: true,
        },
      });

      throw new HttpException(
        {
          message: 'Lấy danh sách gói đã xóa thành công',
          data: FormatReturnData(packages, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ packages.service.ts -> findAllDeleted', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại',
        error,
      );
    }
  }

  // ! Get package by slug
  async findBySlug(slug: string) {
    try {
      const findPackage = await this.prismaService.packages.findUnique({
        where: { slug },
        include: {
          menus: true,
          decors: true,
          party_types: true,
        },
      });

      if (!findPackage) {
        throw new NotFoundException('Gói không tồn tại');
      }

      throw new HttpException(
        {
          message: 'Lấy gói thành công',
          data: FormatReturnData(findPackage, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ packages.service.ts -> findBySlug', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại',
        error,
      );
    }
  }

  // ! Update package
  async update(
    id: number,
    updatePackageDto: UpdatePackageDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const {
        name,
        decor_id,
        menu_id,
        party_type_id,
        description,
        price,
        short_description,
        extra_sevice,
      } = updatePackageDto;
      let checkPrice = 0;

      // Check Name & slug
      const slug = MakeSlugger(name);
      const findPackageByName = await this.prismaService.packages.findFirst({
        where: { OR: [{ name }, { slug }] },
      });

      if (findPackageByName && findPackageByName.id !== id) {
        throw new BadRequestException('Tên gói đã tồn tại');
      }

      // ? Check Package ID
      const findPackage = await this.prismaService.packages.findUnique({
        where: { id: Number(id) },
      });

      if (!findPackage) {
        throw new NotFoundException('Gói không tồn tại');
      }

      // ? Check decor_id
      const findDecor = await this.prismaService.decors.findUnique({
        where: { id: Number(decor_id) },
      });

      if (!findDecor) {
        throw new NotFoundException('ID Trang trí không tồn tại');
      }
      checkPrice += findDecor.price;

      // ? Check menu_id
      const findMenu = await this.prismaService.menus.findUnique({
        where: { id: Number(menu_id) },
      });
      checkPrice += findMenu.price;

      if (!findMenu) {
        throw new NotFoundException('ID Menu không tồn tại');
      }

      // ? Check party_type_id
      const findPartyType = await this.prismaService.party_types.findUnique({
        where: { id: Number(party_type_id) },
      });

      if (!findPartyType) {
        throw new NotFoundException('ID Loại tiệc không tồn tại');
      }
      checkPrice += findPartyType.price;

      // ? Check Extra Service
      extra_sevice.forEach(async (service) => {
        const findService = await this.prismaService.products.findUnique({
          where: { id: Number(service.id) },
        });

        if (!findService) {
          throw new NotFoundException('ID Sản Phẩm không tồn tại');
        }
        checkPrice += findService.price * service.quantity;
      });

      // ? Check Price
      if (Number(price) !== Number(checkPrice)) {
        throw new BadRequestException('Giá không chính xác');
      }
      let uploadImages;
      // Upload images
      if (files.images.length > 0) {
        uploadImages = await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/packages',
        );

        if (!uploadImages) {
          throw new BadRequestException('Upload ảnh thất bại');
        }
      }

      // Update Package
      const updatePackage = await this.prismaService.packages.update({
        where: { id: id },
        data: {
          name,
          slug,
          decor_id: Number(decor_id),
          menu_id: Number(menu_id),
          party_type_id: Number(party_type_id),
          description,
          price: Number(price),
          short_description,
          images: uploadImages ? uploadImages : findPackage.images,
          extra_service: extra_sevice,
        },
        include: {
          menus: true,
          decors: true,
          party_types: true,
        },
      });

      throw new HttpException(
        {
          message: 'Cập nhật gói thành công',
          data: FormatReturnData(updatePackage, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ packages.service.ts -> update', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại',
        error,
      );
    }
  }

  // ! Soft delete package
  async remove(id: number, reqUser) {
    try {
      const findPackage = await this.prismaService.packages.findUnique({
        where: { id: Number(id) },
      });

      if (!findPackage) {
        throw new NotFoundException('Gói không tồn tại');
      }

      await this.prismaService.packages.update({
        where: { id: Number(id) },
        data: {
          deleted: true,
          deleted_by: reqUser.id,
          deleted_at: new Date(),
        },
      });

      throw new HttpException(
        {
          message: 'Xóa gói tạm thời thành công',
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ packages.service.ts -> remove', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại',
        error,
      );
    }
  }

  // ! Restore package
  async restore(id: number) {
    try {
      const findPackage = await this.prismaService.packages.findUnique({
        where: { id: Number(id) },
      });

      if (!findPackage) {
        throw new NotFoundException('Gói không tồn tại');
      }

      await this.prismaService.packages.update({
        where: { id: Number(id) },
        data: {
          deleted: false,
          deleted_by: null,
          deleted_at: null,
        },
      });

      throw new HttpException(
        {
          message: 'Khôi phục gói thành công',
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ packages.service.ts -> restore', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại',
        error,
      );
    }
  }

  // ! Hard delete package
  async destroy(id: number) {
    try {
      const findPackage = await this.prismaService.packages.findUnique({
        where: { id: Number(id) },
      });

      if (!findPackage) {
        throw new NotFoundException('Gói không tồn tại');
      }

      await this.prismaService.packages.delete({
        where: { id: Number(id) },
      });

      throw new HttpException(
        {
          message: 'Xóa gói thành công',
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ packages.service.ts -> delete', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại',
        error,
      );
    }
  }
}
