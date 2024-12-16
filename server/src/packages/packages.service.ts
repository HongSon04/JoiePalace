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
import { handleErrorHelper } from 'helper/handleErrorHelper';
import { FilterPackagesDto } from './dto/FilterPackages.dto';

@Injectable()
export class PackagesService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create package
  async create(
    reqUser,
    createPackageDto: CreatePackageDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const {
        name,
        stage_id,
        decor_id,
        menu_id,
        party_type_id,
        description,
        price,
        short_description,
        other_service,
        note,
        is_show,
        budget,
        number_of_guests,
      } = createPackageDto;

      // Validate images
      if (!files.images?.length) {
        throw new BadRequestException('Ảnh không được để trống');
      }
      // Validate unique name and slug
      const slug = MakeSlugger(name);
      const existingPackage = await this.prismaService.packages.findFirst({
        where: { OR: [{ name }, { slug }] },
      });
      if (existingPackage) {
        throw new BadRequestException('Tên gói đã tồn tại');
      }

      // Validate and calculate total price
      const totalPrice = await this.calculateTotalPrice({
        stage_id,
        decor_id,
        menu_id,
        party_type_id,
        other_service,
        number_of_guests,
      });

      if (Number(price) !== totalPrice) {
        throw new BadRequestException(
          `Giá không chính xác, giá thực: ${totalPrice}`,
        );
      }

      // Upload images
      const images = await this.cloudinaryService.uploadMultipleFilesToFolder(
        files.images,
        'joiepalace/packages',
      );
      if (!images) {
        throw new BadRequestException('Upload ảnh thất bại');
      }

      // Create package with all validated data
      const createdPackage = await this.prismaService.packages.create({
        data: {
          name,
          slug,
          user_id: reqUser.id,
          stage_id: stage_id ? Number(stage_id) : null,
          decor_id: decor_id ? Number(decor_id) : null,
          menu_id: menu_id ? Number(menu_id) : null,
          party_type_id: party_type_id ? Number(party_type_id) : null,
          description,
          price: Number(price),
          short_description,
          images: images as any,
          other_service,
          note,
          is_show: String(is_show) === 'true',
          budget: budget,
          number_of_guests: Number(number_of_guests),
        },
        include: {
          stages: true,
          menus: {
            include: {
              products: {
                include: {
                  tags: true,
                },
              },
            },
          },
          decors: true,
          party_types: true,
          users: true,
        },
      });

      throw new HttpException(
        {
          message: 'Tạo gói thành công',
          data: FormatReturnData(createdPackage, []),
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      return handleErrorHelper(error, 'packages.service.ts -> create');
    }
  }

  // ! Get all packages
  async findAll(query: FilterPackagesDto) {
    try {
      const { is_show, deleted } = query;
      const whereConditions: any = {};

      if (is_show !== null) {
        whereConditions.is_show = String(is_show) === 'true';
      }

      if (deleted !== null) {
        whereConditions.deleted = String(deleted) === 'true';
      }

      const packages = await this.prismaService.packages.findMany({
        where: whereConditions,
        include: {
          menus: {
            include: {
              products: {
                include: {
                  tags: true,
                },
              },
            },
          },
          decors: true,
          party_types: true,
          users: true,
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get one package
  async findOne(id: number) {
    try {
      const findPackage = await this.prismaService.packages.findUnique({
        where: { id: Number(id) },
        include: {
          menus: {
            include: {
              products: {
                include: {
                  tags: true,
                },
              },
            },
          },
          decors: true,
          party_types: true,
          users: true,
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get package by slug
  async findBySlug(slug: string) {
    try {
      const findPackage = await this.prismaService.packages.findUnique({
        where: { slug },
        include: {
          menus: {
            include: {
              products: {
                include: {
                  tags: true,
                },
              },
            },
          },
          decors: true,
          party_types: true,
          users: true,
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
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
        stage_id,
        decor_id,
        menu_id,
        party_type_id,
        description,
        price,
        short_description,
        other_service,
        note,
        is_show,
        budget,
        number_of_guests,
      } = updatePackageDto;

      // ? Find Package By Id
      const findPackageById = await this.prismaService.packages.findUnique({
        where: { id: Number(id) },
      });

      if (!findPackageById) {
        throw new NotFoundException('Gói không tồn tại');
      }

      // Validate unique name and slug
      const slug = MakeSlugger(name);
      const existingPackage = await this.prismaService.packages.findFirst({
        where: { OR: [{ name }, { slug }], NOT: { id: Number(id) } },
      });
      if (existingPackage) {
        throw new BadRequestException('Tên gói đã tồn tại');
      }

      // Calculate total price from all components
      const totalPrice = await this.calculateTotalPrice({
        stage_id,
        decor_id,
        menu_id,
        party_type_id,
        other_service,
        number_of_guests,
      });

      // Validate total price
      if (Number(price) !== totalPrice) {
        throw new BadRequestException(
          `Giá không chính xác, giá thực: ${totalPrice}`,
        );
      }

      let uploadImages;
      // Upload images
      if (files?.images?.length > 0) {
        uploadImages = await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/packages',
        );

        if (!uploadImages) {
          throw new BadRequestException('Upload ảnh thất bại');
        }
      }

      // Update package with validated data
      const updatedPackage = await this.prismaService.packages.update({
        where: { id },
        data: {
          name,
          slug: MakeSlugger(name),
          stage_id: stage_id ? Number(stage_id) : null,
          decor_id: decor_id ? Number(decor_id) : null,
          menu_id: menu_id ? Number(menu_id) : null,
          party_type_id: party_type_id ? Number(party_type_id) : null,
          description,
          price: Number(price),
          short_description,
          images: [...(uploadImages || []), ...(findPackageById.images || [])],
          other_service,
          note,
          is_show: String(is_show) === 'true',
          budget: budget,
          number_of_guests: Number(number_of_guests),
        },
        include: {
          stages: true,
          menus: {
            include: {
              products: {
                include: {
                  tags: true,
                },
              },
            },
          },
          decors: true,
          party_types: true,
          users: true,
        },
      });

      throw new HttpException(
        {
          message: 'Cập nhật gói thành công',
          data: FormatReturnData(updatedPackage, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ packages.service.ts -> update', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
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

      if (!findPackage.deleted) {
        throw new BadRequestException(
          'Gói không bị xóa tạm thời, không thể khôi phục!',
        );
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
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

      if (!findPackage.deleted) {
        throw new BadRequestException(
          'Gói không bị xóa tạm thời, không thể xóa vĩnh viễn!',
        );
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Calculate total price
  private async calculateTotalPrice({
    stage_id,
    decor_id,
    menu_id,
    party_type_id,
    other_service,
    number_of_guests,
  }) {
    let totalPrice = 0;

    // Validate stage
    if (stage_id) {
      const stage = await this.prismaService.stages.findUnique({
        where: { id: Number(stage_id) },
      });
      if (!stage) {
        throw new NotFoundException('ID Sảnh không tồn tại');
      }
      console.log('stage-price: ' + stage.price);
      totalPrice += Number(stage.price);
    }

    // Add decor price
    if (decor_id) {
      const decor = await this.prismaService.decors.findUnique({
        where: { id: Number(decor_id) },
      });
      if (!decor) {
        throw new NotFoundException('ID Trang trí không tồn tại');
      }
      console.log('decor-price: ' + decor.price);
      totalPrice += Number(decor.price);
    }

    // Add menu price
    if (menu_id) {
      const menu = await this.prismaService.menus.findUnique({
        where: { id: Number(menu_id) },
      });
      if (!menu) {
        throw new NotFoundException('ID Menu không tồn tại');
      }
      const tableCount = Math.ceil(Number(number_of_guests) / 10);
      console.log('tableCount: ' + tableCount);
      console.log('total-menu: ' + Number(menu.price * tableCount));
      totalPrice += Number(menu.price) * tableCount;
    }

    // Add party type price
    if (party_type_id) {
      const partyType = await this.prismaService.party_types.findUnique({
        where: { id: Number(party_type_id) },
      });
      if (!partyType) {
        throw new NotFoundException('ID Loại tiệc không tồn tại');
      }

      console.log('party_type-price: ' + partyType.price);
      totalPrice += Number(partyType.price);
    }

    // Add other services price
    if (other_service) {
      const jsonString = this.formatJsonString(other_service);
      const serviceArray = JSON.parse(jsonString);

      await Promise.all(
        serviceArray.map(async (other: any) => {
          const product = await this.prismaService.products.findUnique({
            where: { id: Number(other.id) },
          });

          if (!product) {
            throw new NotFoundException('Không tìm thấy dịch vụ khác');
          }
          console.log(
            'product: ' + Number(product.price) * Number(other.quantity),
          );
          totalPrice += Number(product.price) * Number(other.quantity);

          // Enrich other service data
          Object.assign(other, {
            name: product.name,
            amount: Number(product.price),
            total_price: Number(product.price) * Number(other.quantity),
            description: product.description,
            short_description: product.short_description,
            images: product.images,
            quantity: Number(other.quantity),
          });
        }),
      );
    }

    return totalPrice;
  }

  // ! Format JSON string
  private formatJsonString(jsonStr: string): string {
    return jsonStr
      .replace(/;/g, ',')
      .replace(/\s+/g, '')
      .replace(/([{,])(\w+):/g, '$1"$2":');
  }
}
