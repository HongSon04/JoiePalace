import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException('Có lỗi xảy ra', HttpStatus.BAD_REQUEST);
    }
  }

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
      throw new HttpException('Có lỗi xảy ra', HttpStatus.BAD_REQUEST);
    }
  }

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
      throw new HttpException('Có lỗi xảy ra', HttpStatus.BAD_REQUEST);
    }
  }

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

      const stagesRes = await this.prismaService.stages.update({
        where: { id: Number(stage_id) },
        data: {
          location_id: body.location_id,
          name: body.name,
          description: body.description,
          images: stagesImages as any,
        },
      });

      throw new HttpException(
        { message: 'Cập nhật sảnh thành công', data: stagesRes },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Có lỗi xảy ra', HttpStatus.BAD_REQUEST);
    }
  }

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
      throw new HttpException('Có lỗi xảy ra', HttpStatus.BAD_REQUEST);
    }
  }
}
