import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateLocationDto,
  ImageUploadLocationDto,
} from './dto/create-location.dto';
import { PrismaService } from 'src/prisma.service';
import { FilterDto } from 'helper/dto/Filter.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MakeSlugger } from 'helper/slug';
import { SpacesService } from 'src/spaces/spaces.service';

@Injectable()
export class LocationsService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
    private spacesService: SpacesService,
  ) {}

  // ! Create A New Location
  async createLocation(
    location: CreateLocationDto,
    files: ImageUploadLocationDto,
  ) {
    const locationImages: Partial<ImageUploadLocationDto> = {};
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
        fileKey: keyof ImageUploadLocationDto,
        folder: string,
      ) => {
        if (files[fileKey]) {
          const images =
            await this.cloudinaryService.uploadMultipleFilesToFolder(
              files[fileKey],
              folder,
            );
          locationImages[fileKey] = images;
        }
      };

      // Upload tất cả các hình ảnh đồng thời
      await Promise.all([
        uploadImages('images', 'joieplace/location'),
        uploadImages('diagram_images', 'joieplace/diagram'),
        uploadImages('slogan_images', 'joieplace/slogan'),
        uploadImages('equipment_images', 'joieplace/equipment'),
        uploadImages('space_images', 'joieplace/space'),
      ]);

      const { name, address, phone, email } = location;

      // Tạo slug cho địa điểm
      const slug = MakeSlugger(name);

      // Tạo Location mới
      const createLocation = await this.prismaService.locations.create({
        data: {
          email,
          slug,
          name,
          address,
          phone,
          images: locationImages.images,
        },
      });

      // Tạo Location Detail mới
      const createLocationDetail =
        await this.prismaService.location_details.create({
          data: {
            location_id: createLocation.id,
            slogan: location.slogan,
            slogan_description: location.slogan_description,
            diagram_description: location.diagram_description,
            equipment_description: location.equipment_description,
            slogan_images: locationImages.slogan_images,
            diagram_images: locationImages.diagram_images,
            equipment_images: locationImages.equipment_images,
          },
        });

      // Tạo Space mới
      const bodySpace = {
        location_id: createLocation.id,
        name: location.spaces_name,
        slug: MakeSlugger(location.spaces_name),
        description: location.spaces_description,
        images: locationImages.space_images,
      };
      const createSpace = await this.prismaService.spaces.create({
        data: bodySpace,
      });

      const { deleted, deleted_at, deleted_by, ...data } = createLocation;
      const result = {
        ...data,
        location_detail: createLocationDetail,
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
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
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

    throw new HttpException(
      {
        data: res,
        pagination: {
          total: res.length,
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

  // ! Get Location By Id
  async getLocationById(id: number) {
    const location = await this.prismaService.locations.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!location) {
      throw new HttpException('Địa điểm không tồn tại', HttpStatus.BAD_REQUEST);
    }
    const location_detail =
      await this.prismaService.location_details.findUnique({
        where: {
          id: Number(id),
        },
      });

    const spaces = await this.prismaService.spaces.findMany({
      where: {
        location_id: Number(id),
      },
    });
    const stages = await this.prismaService.stages.findMany({
      where: {
        location_id: Number(id),
      },
    });
    const { deleted, deleted_at, deleted_by, ...data } = location;
    let result = {
      ...data,
      location_detail: location_detail,
      space: spaces,
    };

    throw new HttpException({ data: result }, HttpStatus.OK);
  }

  // ! Get Location By Slug
  async getLocationBySlug(slug: string) {
    try {
      const location = await this.prismaService.locations.findFirst({
        where: {
          slug,
        },
      });
      if (!location) {
        throw new HttpException(
          'Địa điểm không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }
      const location_detail =
        await this.prismaService.location_details.findFirst({
          where: {
            location_id: location.id,
          },
        });

      const spaces = await this.prismaService.spaces.findMany({
        where: {
          location_id: location.id,
        },
      });
      const stages = await this.prismaService.stages.findMany({
        where: {
          location_id: location.id,
        },
      });
      const { deleted, deleted_at, deleted_by, ...data } = location;
      let result = {
        ...data,
        location_detail: location_detail,
        space: spaces,
        stages,
      };

      throw new HttpException({ data: result }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Update Location Info
  async updateLocation(
    id: number,
    location: UpdateLocationDto,
    files?: ImageUploadLocationDto,
  ) {
    const locationImages: Partial<ImageUploadLocationDto> = {};
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

      Object.keys(requiredFiles).forEach((key) => {
        if (!files[key]) {
          errors.push(requiredFiles[key]);
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
        fileKey: keyof ImageUploadLocationDto,
        folder: string,
      ) => {
        if (files[fileKey]) {
          const images =
            await this.cloudinaryService.uploadMultipleFilesToFolder(
              files[fileKey],
              folder,
            );
          locationImages[fileKey] = images;
        }
      };

      // Upload các hình ảnh nếu có
      await Promise.all([
        uploadImages('images', 'joieplace/location'),
        uploadImages('diagram_images', 'joieplace/diagram'),
        uploadImages('slogan_images', 'joieplace/slogan'),
        uploadImages('equipment_images', 'joieplace/equipment'),
        uploadImages('space_images', 'joieplace/space'),
      ]);
    }

    try {
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
      } = location;

      // Tạo slug mới nếu cần
      let slug: string | undefined;
      if (name) {
        slug = MakeSlugger(name);
      }

      // Cập nhật Location
      const updateLocation = await this.prismaService.locations.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          slug,
          address,
          phone,
          images: locationImages.images, // Cập nhật hình ảnh nếu có
        },
      });

      // Cập nhật Location Detail
      const updateLocationDetail =
        await this.prismaService.location_details.update({
          where: { location_id: Number(id) },
          data: {
            slogan,
            slogan_description,
            diagram_description,
            equipment_description,
            slogan_images: locationImages.slogan_images,
            diagram_images: locationImages.diagram_images,
            equipment_images: locationImages.equipment_images,
          },
        });

      // Cập nhật Space nếu có
      const updateSpace = await this.prismaService.spaces.update({
        where: { location_id: Number(id) },
        data: {
          name: spaces_name,
          description: spaces_description,
          images: locationImages.space_images,
        },
      });

      const { deleted, deleted_at, deleted_by, ...data } = updateLocation;
      const result = {
        ...data,
        location_detail: updateLocationDetail,
        space: updateSpace,
      };

      throw new HttpException(
        { message: 'Cập nhật địa điểm thành công', data: result },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Soft Delete Location
  async softDeleteLocation(reqUser: any, id: number) {
    try {
      const location = await this.prismaService.locations.findUnique({
        where: {
          id: Number(id),
        },
      });
      console.log(Number(reqUser.id));
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
          deleted_by: Number(reqUser.id),
        },
      });
      throw new HttpException('Xóa địa điểm thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
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
      throw new HttpException('Khôi phục địa điểm thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Hard Delete Location
  async hardDeleteLocation(id: number) {
    try {
      const locationId = Number(id);
      const location = await this.prismaService.locations.findUnique({
        where: { id: locationId },
      });
      if (!location) {
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
            where: { location_id: locationId },
          }),
        () =>
          this.prismaService.stages.deleteMany({
            where: { location_id: locationId },
          }),
        (stage) => stage.images || [],
      );

      // ! Xóa Spaces
      await deleteEntityImagesAndRecords(
        () =>
          this.prismaService.spaces.findMany({
            where: { location_id: locationId },
          }),
        () =>
          this.prismaService.spaces.deleteMany({
            where: { location_id: locationId },
          }),
        (space) => space.images || [],
      );

      // Xóa Location Detail
      const locationDetail =
        await this.prismaService.location_details.findUnique({
          where: { id: locationId },
        });
      if (locationDetail) {
        const locationDetailImages = [
          locationDetail.slogan_images,
          locationDetail.diagram_images,
          locationDetail.equipment_images,
        ]
          .flat()
          .filter(Boolean);
        if (locationDetailImages.length > 0) {
          await this.cloudinaryService.deleteMultipleImagesByUrl(
            locationDetailImages,
          );
        }
        await this.prismaService.location_details.delete({
          where: { id: locationId },
        });
      }

      // Xóa Location

      if (location && location.images?.length) {
        await this.cloudinaryService.deleteMultipleImagesByUrl(location.images);
      }
      await this.prismaService.locations.delete({ where: { id: locationId } });

      throw new HttpException('Xóa địa điểm thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Delete Image By Url
  async deleteImageByUrl(url: any) {
    const models = [
      { name: 'locations', imageField: 'images' },
      {
        name: 'location_details',
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
                  set: record[imageField].filter((img: string) => img !== url),
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
  }
}
