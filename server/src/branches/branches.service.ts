import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBranchDto, ImageUploadBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FilterDto } from 'helper/dto/Filter.dto';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';
import { MakeSlugger } from 'helper/slug';

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
      space_images: 'Hình ảnh không gian không được để trống',
    };

    Object.keys(requiredFiles).forEach((key) => {
      if (!files[key]) {
        errors.push(requiredFiles[key]);
      }
    });

    // Nếu có lỗi, trả về ngay lập tức và không tiến hành upload
    if (errors.length > 0) {
      throw new HttpException(
        { message: errors.join(', '), data: null },
        HttpStatus.BAD_REQUEST,
      );
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
        uploadImages('images', 'joieplace/branch'),
        uploadImages('diagram_images', 'joieplace/diagram'),
        uploadImages('slogan_images', 'joieplace/slogan'),
        uploadImages('equipment_images', 'joieplace/equipment'),
        uploadImages('space_images', 'joieplace/space'),
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
      });

      // Tạo Space mới
      const bodySpace = {
        branch_id: createbranch.id,
        name: branch.spaces_name,
        slug: MakeSlugger(branch.spaces_name),
        description: branch.spaces_description,
        images: branchImages.space_images,
      };
      const createSpace = await this.prismaService.spaces.create({
        data: bodySpace,
      });

      const { deleted, deleted_at, deleted_by, ...data } = createbranch;
      const result = {
        ...data,
        space: createSpace,
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get All Branches
  async getAllBranches(query: FilterDto) {
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
        created_at: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        ...sortRangeDate,
      };

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.branches.findMany({
          where: whereConditions,
          skip: skip,
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
          data: res,
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> getAllbranchs', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
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
        created_at: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        ...sortRangeDate,
      };

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.branches.findMany({
          where: whereConditions,
          skip: skip,
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
          data: res,
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> getAllDeletedbranchs', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get Branch By Id
  async getBranchById(id: number) {
    try {
      const branch = await this.prismaService.branches.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!branch) {
        throw new HttpException(
          'Địa điểm không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      const spaces = await this.prismaService.spaces.findMany({
        where: {
          branch_id: Number(id),
        },
      });
      const stages = await this.prismaService.stages.findMany({
        where: {
          branch_id: Number(id),
        },
      });
      const { deleted, deleted_at, deleted_by, ...data } = branch;
      let result = {
        ...data,
        spaces,
        stages,
      };

      throw new HttpException({ data: result }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> getbranchById', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get Branch By Slug
  async getBranchBySlug(slug: string) {
    try {
      const branch = await this.prismaService.branches.findFirst({
        where: {
          slug,
        },
      });
      if (!branch) {
        throw new HttpException(
          'Địa điểm không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      const spaces = await this.prismaService.spaces.findMany({
        where: {
          branch_id: branch.id,
        },
      });
      const stages = await this.prismaService.stages.findMany({
        where: {
          branch_id: branch.id,
        },
      });
      const { deleted, deleted_at, deleted_by, ...data } = branch;
      let result = {
        ...data,
        spaces,
        stages,
      };

      throw new HttpException({ data: result }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> getbranchBySlug', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
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
          space_images: 'Hình ảnh không gian không được để trống',
        };

        Object.entries(requiredFiles).forEach(([key, message]) => {
          if (!files[key]) {
            errors.push(message);
          }
        });

        if (errors.length > 0) {
          throw new HttpException(
            { message: errors.join(', '), data: null },
            HttpStatus.BAD_REQUEST,
          );
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
        spaces_name,
        spaces_description,
      } = branch;

      // Tạo slug mới nếu cần
      const slug = name ? MakeSlugger(name) : undefined;

      // Kiểm tra tên địa điểm đã tồn tại
      const checkNamebranch = await this.prismaService.branches.findFirst({
        where: { name, NOT: { id: Number(id) } },
      });

      if (checkNamebranch) {
        throw new HttpException(
          'Tên địa điểm đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Cập nhật branch
      const updatedbranch = await this.prismaService.branches.update({
        where: { id: Number(id) },
        data: {
          name,
          slug,
          address,
          phone,
          images: branchImages.images,
          slogan,
          slogan_description,
          diagram_description,
          equipment_description,
          slogan_images: branchImages.slogan_images,
          diagram_images: branchImages.diagram_images,
          equipment_images: branchImages.equipment_images,
        },
      });

      // Cập nhật Space nếu có
      const updatedSpace = await this.prismaService.spaces.update({
        where: { branch_id: Number(id) },
        data: {
          name: spaces_name,
          description: spaces_description,
          images: branchImages.space_images,
        },
      });

      const stages = await this.prismaService.stages.findMany({
        where: { branch_id: Number(id) },
      });

      const result = {
        ...updatedbranch,
        space: updatedSpace,
        stages,
      };

      throw new HttpException(
        { message: 'Cập nhật địa điểm thành công', data: result },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ branches.service.ts -> updatebranch', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
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
        throw new HttpException(
          'Địa điểm không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
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
        throw new HttpException(
          'Địa điểm không tồn tại',
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
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
        throw new HttpException(
          'Địa điểm không tồn tại',
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
            where: { branch_id: branch_id },
          }),
        () =>
          this.prismaService.stages.deleteMany({
            where: { branch_id: branch_id },
          }),
        (stage) => stage.images || [],
      );

      // ! Xóa Spaces
      await deleteEntityImagesAndRecords(
        () =>
          this.prismaService.spaces.findMany({
            where: { branch_id: branch_id },
          }),
        () =>
          this.prismaService.spaces.deleteMany({
            where: { branch_id: branch_id },
          }),
        (space) => space.images || [],
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
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
        { name: 'spaces', imageField: 'images' },
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
              where: { id: record.id },
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }
}