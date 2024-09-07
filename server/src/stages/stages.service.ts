import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { StageDto } from './dto/stage.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { StageUpdateDto } from './dto/stage-update.dto';

@Injectable()
export class StagesService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create stage
  async create(body: StageDto, files: { images?: Express.Multer.File[] }) {
    try {
      const findLocation = await this.prismaService.locations.findUnique({
        where: { id: body.location_id },
      });
      if (!findLocation) {
        throw new HttpException(
          'Không tìm thấy địa điểm',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!files.images) {
        throw new HttpException(
          'Không được để trống ảnh',
          HttpStatus.BAD_REQUEST,
        );
      }
      const stagesImages =
        await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joieplace/stages',
        );
      if (!stagesImages) {
        throw new HttpException(
          'Lỗi khi upload ảnh, vui lòng thử lại',
          HttpStatus.BAD_REQUEST,
        );
      }

      const stagesRes = await this.prismaService.stages.create({
        data: {
          location_id: body.location_id,
          name: body.name,
          description: body.description,
          images: stagesImages as any,
        },
      });

      throw new HttpException(
        { message: 'Tạo sảnh thành công', data: stagesRes },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ stages.service.ts -> create: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get all stages
  async getAll(location_id: number) {
    try {
      if (location_id) {
        const findLocation = await this.prismaService.locations.findUnique({
          where: { id: Number(location_id) },
        });
        if (!findLocation) {
          throw new HttpException(
            'Không tìm thấy địa điểm',
            HttpStatus.BAD_REQUEST,
          );
        }
        const stages = await this.prismaService.stages.findMany({
          where: { id: Number(location_id) },
        });
        throw new HttpException(
          { message: 'Thành công', data: stages },
          HttpStatus.OK,
        );
      } else {
        const stages = await this.prismaService.stages.findMany();
        throw new HttpException(
          { message: 'Thành công', data: stages },
          HttpStatus.OK,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ stages.service.ts -> getAll: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get stage by id
  async getStageById(stage_id: number) {
    try {
      const findStage = await this.prismaService.stages.findUnique({
        where: { id: Number(stage_id) },
      });
      if (!findStage) {
        throw new HttpException('Không tìm thấy sảnh', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        { message: 'Thành công', data: findStage },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ stages.service.ts -> getStageById: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Update stage
  async update(
    stage_id: number,
    body: StageUpdateDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const findStage = await this.prismaService.stages.findUnique({
        where: { id: Number(stage_id) },
      });

      if (!findStage) {
        throw new HttpException('Không tìm thấy sảnh', HttpStatus.BAD_REQUEST);
      }

      const findStageByName = await this.prismaService.stages.findFirst({
        where: { name: body.name, id: { not: Number(stage_id) } },
      });

      if (findStageByName) {
        throw new HttpException(
          'Tên sảnh đã tồn tại, vui lòng chọn tên khác',
          HttpStatus.BAD_REQUEST,
        );
      }

      const updateData: any = {
        location_id: body.location_id,
        name: body.name,
        description: body.description,
      };

      if (files.images && files.images.length > 0) {
        const stagesImages =
          await this.cloudinaryService.uploadMultipleFilesToFolder(
            files.images,
            'joieplace/stages',
          );

        if (!stagesImages || stagesImages.length === 0) {
          throw new HttpException(
            'Lỗi khi upload ảnh, vui lòng thử lại',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Delete old images
        await this.cloudinaryService.deleteMultipleImagesByUrl(
          findStage.images,
        );

        updateData.images = stagesImages as any;
      }

      const stagesRes = await this.prismaService.stages.update({
        where: { id: Number(stage_id) },
        data: updateData,
      });

      throw new HttpException(
        { message: 'Cập nhật sảnh thành công', data: stagesRes },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ stages.service.ts -> update: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Delete stage
  async delete(stage_id: number) {
    try {
      const findStage = await this.prismaService.stages.findUnique({
        where: { id: Number(stage_id) },
      });
      if (!findStage) {
        throw new HttpException('Không tìm thấy sảnh', HttpStatus.BAD_REQUEST);
      }
      await this.cloudinaryService.deleteMultipleImagesByUrl(findStage.images);
      await this.prismaService.stages.delete({
        where: { id: Number(stage_id) },
      });
      throw new HttpException('Xóa sảnh thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ stages.service.ts -> delete: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }
}
