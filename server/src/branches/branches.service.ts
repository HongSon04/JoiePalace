import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FilterDto } from 'helper/dto/Filter.dto';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';
import { FormatReturnData } from 'helper/FormatReturnData';
import { MakeSlugger } from 'helper/slug';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { CreateBranchDto, ImageUploadBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create A New branch
  async createBranch(branch: CreateBranchDto, files: ImageUploadBranchDto) {
    const branchImages: Partial<ImageUploadBranchDto> = {};
    const errors: string[] = [];

    // Kiểm tra tất cả các file yêu cầu có đủ hay không trước khi upload
    const requiredFiles = {
      images: 'Hình ảnh không được để trống',
      diagram_images: 'Hình ảnh sơ đồ không được để trống',
      slogan_images: 'Hình ảnh slogan không được để trống',
      equipment_images: 'Hình ảnh thiết bị không được để trống',
    };

    Object.keys(requiredFiles).forEach((key) => {
      if (!files[key]) {
        errors.push(requiredFiles[key]);
      }
    });

    // Nếu có lỗi, trả về ngay lập tức và không tiến hành upload
    if (errors.length > 0) {
      throw new BadRequestException({ message: errors.join(', '), data: null });
    }

    try {
      // Tạo một hàm trợ giúp để upload ảnh
      const uploadImages = async (
        fileKey: keyof ImageUploadBranchDto,
        folder: string,
      ) => {
        if (files[fileKey]) {
          const images =
            await this.cloudinaryService.uploadMultipleFilesToFolder(
              files[fileKey],
              folder,
            );
          branchImages[fileKey] = images;
        }
      };

      // Upload tất cả các hình ảnh đồng thời
      await Promise.all([
        uploadImages('images', 'joiepalace/branch'),
        uploadImages('diagram_images', 'joiepalace/diagram'),
        uploadImages('slogan_images', 'joiepalace/slogan'),
        uploadImages('equipment_images', 'joiepalace/equipment'),
      ]);

      const { name, address, phone, email } = branch;

      // Tạo slug cho địa điểm
      const slug = MakeSlugger(name);

      // Tạo branch mới
      const createbranch = await this.prismaService.branches.create({
        data: {
          email,
          slug,
          name,
          address,
          phone,
          images: branchImages.images,
          slogan: branch.slogan,
          slogan_description: branch.slogan_description,
          diagram_description: branch.diagram_description,
          equipment_description: branch.equipment_description,
          slogan_images: branchImages.slogan_images,
          diagram_images: branchImages.diagram_images,
          equipment_images: branchImages.equipment_images,
        },
        include: {
          stages: true,
        },
      });

      const result = {
        ...FormatReturnData(createbranch, []),
      };

      throw new HttpException(
        {
          message: 'Thêm địa điểm thành công',
          data: result,
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> createbranch', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get All Branches
  async getAllBranches(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const search = query.search || '';
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const skip = (page - 1) * itemsPerPage;
      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : null;
      const endDate = query.endDate
        ? FormatDateToEndOfDay(query.endDate)
        : null;

      // ? Range Date Conditions
      const sortRangeDate: any =
        startDate && endDate
          ? {
              created_at: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {};

      const whereConditions = {
        deleted: false,
        ...sortRangeDate,
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
        ];
      }

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.branches.findMany({
          where: whereConditions,
          include: {
            stages: true,
          },
          skip: Number(skip),
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.branches.count({
          where: whereConditions,
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        lastPage,
        nextPage: page < lastPage ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        currentPage: page,
        itemsPerPage,
        total,
      };
      throw new HttpException(
        {
          data: FormatReturnData(res, []),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> getAllbranchs', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get All Deleted Branches
  async getAllDeletedBranches(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const search = query.search || '';
      const itemsPerPage = Number(query.itemsPerPage) || 1;
      const skip = (page - 1) * itemsPerPage;
      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : null;
      const endDate = query.endDate
        ? FormatDateToEndOfDay(query.endDate)
        : null;

      // ? Range Date Conditions
      const sortRangeDate: any =
        startDate && endDate
          ? {
              created_at: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {};

      const whereConditions = {
        deleted: true,
        ...sortRangeDate,
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
        ];
      }

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.branches.findMany({
          where: whereConditions,
          include: {
            stages: true,
          },
          skip: Number(skip),
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.branches.count({
          where: whereConditions,
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        lastPage,
        nextPage: page < lastPage ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        currentPage: page,
        itemsPerPage,
        total,
      };
      throw new HttpException(
        {
          data: FormatReturnData(res, []),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> getAllDeletedbranchs', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get Branch By Id
  async getBranchById(id: number) {
    try {
      const branch = await this.prismaService.branches.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          stages: true,
        },
      });
      if (!branch) {
        throw new NotFoundException('Địa điểm không tồn tại');
      }

      const stages = await this.prismaService.stages.findMany({
        where: {
          branch_id: Number(id),
        },
      });
      const { deleted, deleted_at, deleted_by, ...data } = branch;
      let result = {
        ...data,
        stages,
      };

      throw new HttpException(
        { data: FormatReturnData(result, []) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> getbranchById', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get Branch By Slug
  async getBranchBySlug(slug: string) {
    try {
      const branch = await this.prismaService.branches.findFirst({
        where: {
          slug,
        },
        include: {
          stages: true,
        },
      });
      if (!branch) {
        throw new NotFoundException('Địa điểm không tồn tại');
      }

      throw new HttpException(
        { data: FormatReturnData(branch, []) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> getbranchBySlug', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Update Branch Info
  async updateBranch(
    id: number,
    branch: UpdateBranchDto,
    files?: ImageUploadBranchDto,
  ) {
    try {
      const branchImages: Partial<ImageUploadBranchDto> = {};
      const errors: string[] = [];

      // Kiểm tra các file nếu có yêu cầu upload ảnh mới
      if (files) {
        const requiredFiles = {
          images: 'Hình ảnh không được để trống',
          diagram_images: 'Hình ảnh sơ đồ không được để trống',
          slogan_images: 'Hình ảnh slogan không được để trống',
          equipment_images: 'Hình ảnh thiết bị không được để trống',
        };

        Object.entries(requiredFiles).forEach(([key, message]) => {
          if (!files[key]) {
            errors.push(message);
          }
        });

        if (errors.length > 0) {
          throw new BadRequestException({
            message: errors.join(', '),
            data: null,
          });
        }

        // Tạo hàm upload ảnh mới nếu cần
        const uploadImages = async (
          fileKey: keyof ImageUploadBranchDto,
          folder: string,
        ) => {
          if (files[fileKey]) {
            branchImages[fileKey] =
              await this.cloudinaryService.uploadMultipleFilesToFolder(
                files[fileKey],
                folder,
              );
          }
        };

        // Upload các hình ảnh nếu có
        await Promise.all(
          Object.entries(files).map(([key]) =>
            uploadImages(key as keyof ImageUploadBranchDto, `joieplace/${key}`),
          ),
        );
      }

      const {
        name,
        address,
        phone,
        slogan,
        slogan_description,
        diagram_description,
        equipment_description,
      } = branch;

      // Tạo slug mới nếu cần
      const slug = name ? MakeSlugger(name) : undefined;

      // Kiểm tra tên địa điểm đã tồn tại và không phải id hiện tại
      const checkNamebranch = await this.prismaService.branches.findFirst({
        where: { AND: [{ name }, { id: { not: Number(id) } }] },
      });

      if (checkNamebranch) {
        throw new BadRequestException('Tên địa điểm đã tồn tại');
      }

      // ? Find Branches By Id
      const findBranchById = await this.prismaService.branches.findFirst({
        where: { id: Number(id) },
      });

      // Cập nhật branch
      const updatedbranch = await this.prismaService.branches.update({
        where: { id: Number(id) },
        data: {
          name,
          slug,
          address,
          phone,
          images: [
            ...(branchImages.images || []),
            ...(findBranchById.images || []),
          ],
          slogan,
          slogan_description,
          diagram_description,
          equipment_description,
          slogan_images: [
            ...(branchImages.slogan_images || []),
            ...(findBranchById.slogan_images || []),
          ],
          diagram_images: [
            ...(branchImages.diagram_images || []),
            ...(findBranchById.diagram_images || []),
          ],
          equipment_images: [
            ...(branchImages.equipment_images || []),
            ...(findBranchById.equipment_images || []),
          ],
        },
        include: {
          stages: true,
        },
      });

      throw new HttpException(
        { message: 'Cập nhật địa điểm thành công', data: updatedbranch },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> updatebranch', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Soft Delete Branch
  async softDeleteBranch(reqUser: any, id: number) {
    try {
      const branch = await this.prismaService.branches.findUnique({
        where: {
          id: Number(id),
        },
      });
      console.log(Number(reqUser.id));
      if (!branch) {
        throw new NotFoundException('Địa điểm không tồn tại');
      }
      await this.prismaService.branches.update({
        where: {
          id: Number(id),
        },
        data: {
          deleted: true,
          deleted_at: new Date(),
          deleted_by: Number(reqUser.id),
        },
      });
      throw new HttpException('Xóa địa điểm thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> softDeletebranch', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Restore Branch
  async restoreBranch(id: number) {
    try {
      const branch = await this.prismaService.branches.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!branch) {
        throw new NotFoundException('Địa điểm không tồn tại');
      }

      if (branch.deleted === false) {
        throw new HttpException(
          'Chi nhánh chưa được xóa tạm thời, không thể khôi phục!',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prismaService.branches.update({
        where: {
          id: Number(id),
        },
        data: {
          deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
      });
      throw new HttpException('Khôi phục địa điểm thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> restorebranch', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Hard Delete Branch
  async hardDeleteBranch(id: number) {
    try {
      const branch_id = Number(id);
      const branch = await this.prismaService.branches.findUnique({
        where: { id: Number(branch_id) },
      });
      if (!branch) {
        throw new NotFoundException('Địa điểm không tồn tại');
      }

      if (branch.deleted === false) {
        throw new HttpException(
          'Chi nhánh chưa được xóa tạm thời, không thể xóa vĩnh viễn!',
          HttpStatus.BAD_REQUEST,
        );
      }

      // ! Tạo một hàm xử lý chung cho việc xóa ảnh và dữ liệu
      const deleteEntityImagesAndRecords = async (
        findMethod: () => Promise<any[]>,
        deleteMethod: () => Promise<any>,
        extractImages: (entity: any) => string[],
      ) => {
        const entities = await findMethod();
        const images = entities.flatMap(extractImages).filter(Boolean); // Loại bỏ giá trị null hoặc undefined
        if (images.length > 0) {
          await this.cloudinaryService.deleteMultipleImagesByUrl(images);
        }
        await deleteMethod();
      };

      // ! Xóa Stages
      await deleteEntityImagesAndRecords(
        () =>
          this.prismaService.stages.findMany({
            where: { branch_id: Number(branch_id) },
          }),
        () =>
          this.prismaService.stages.deleteMany({
            where: { branch_id: Number(branch_id) },
          }),
        (stage) => stage.images || [],
      );

      // Xóa branch

      if (branch && branch.images?.length) {
        await this.cloudinaryService.deleteMultipleImagesByUrl(branch.images);
      }
      await this.prismaService.branches.delete({
        where: { id: Number(branch_id) },
      });

      throw new HttpException('Xóa địa điểm thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> hardDeletebranch', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Delete Image By Url
  async deleteImageByUrl(url: any) {
    try {
      const models = [
        { name: 'branchs', imageField: 'images' },
        {
          name: 'branch_details',
          imageFields: ['slogan_images', 'diagram_images', 'equipment_images'],
        },
        { name: 'stages', imageField: 'images' },
      ];

      for (const model of models) {
        const { name, imageField, imageFields } = model;

        const records: any = imageField
          ? await this.prismaService[name].findMany({
              where: { [imageField]: { has: url } },
            })
          : await this.prismaService[name].findMany({
              where: {
                OR: imageFields.map((field) => ({
                  [field]: { has: url },
                })),
              },
            });

        if (records.length > 0) {
          const updates = records.map(async (record: any) => {
            const updatedData = imageField
              ? {
                  [imageField]: {
                    set: record[imageField].filter(
                      (img: string) => img !== url,
                    ),
                  },
                }
              : imageFields.reduce((acc, field) => {
                  acc[field] = {
                    set: record[field].filter((img: string) => img !== url),
                  };
                  return acc;
                }, {});

            return this.prismaService[name].update({
              where: { id: Number(record.id) },
              data: updatedData,
            });
          });

          await Promise.all(updates);
          await this.cloudinaryService.deleteImageByUrl(url);
          throw new HttpException('Xóa ảnh thành công', HttpStatus.OK);
        }
      }

      throw new HttpException('Ảnh không tồn tại', HttpStatus.BAD_REQUEST);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> deleteImageByUrl', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }
}
