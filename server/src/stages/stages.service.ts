import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { StageDto } from './dto/stage.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { StageUpdateDto } from './dto/stage-update.dto';
import { FormatReturnData } from 'helper/FormatReturnData';

@Injectable()
export class StagesService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create stage
  async create(body: StageDto, files: { images?: Express.Multer.File[] }) {
    try {
      const {
        name,
        description,
        capacity_min,
        capacity_max,
        branch_id,
        price,
      } = body;

      if (!files.images) {
        throw new BadRequestException('Không được để trống ảnh');
      }

      const findBranch = await this.prismaService.branches.findUnique({
        where: { id: Number(branch_id) },
      });

      if (!findBranch) {
        throw new NotFoundException('Không tìm thấy chi nhánh');
      }

      const stagesImages =
        await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/stages',
        );
      if (stagesImages.length === 0) {
        throw new BadRequestException('Lỗi khi upload ảnh, vui lòng thử lại');
      }

      const stagesRes = await this.prismaService.stages.create({
        data: {
          branch_id: Number(branch_id),
          name: name,
          description: description,
          images: stagesImages as any,
          capacity_min: Number(capacity_min),
          capacity_max: Number(capacity_max),
          price: Number(price),
        },
      });

      throw new HttpException(
        {
          message: 'Tạo sảnh thành công',
          data: FormatReturnData(stagesRes, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ stages.service.ts -> create: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get all stages
  async getAll(branch_id: number) {
    try {
      if (branch_id) {
        const findBranch = await this.prismaService.branches.findUnique({
          where: { id: Number(branch_id) },
          include: { stages: true },
        });
        if (!findBranch) {
          throw new NotFoundException('Không tìm thấy chi nhánh');
        }
        const stages = await this.prismaService.stages.findMany({
          where: { branch_id: Number(branch_id) },
        });
        throw new HttpException(
          { message: 'Thành công', data: stages },
          HttpStatus.OK,
        );
      } else {
        const stages = await this.prismaService.stages.findMany();
        throw new HttpException(
          { message: 'Thành công', data: FormatReturnData(stages, []) },
          HttpStatus.OK,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ stages.service.ts -> getAll: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get stage by id
  async getStageById(stage_id: number) {
    try {
      const findStage = await this.prismaService.stages.findUnique({
        where: { id: Number(stage_id) },
      });
      if (!findStage) {
        throw new NotFoundException('Không tìm thấy sảnh');
      }
      throw new HttpException(
        { message: 'Thành công', data: FormatReturnData(findStage, []) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ stages.service.ts -> getStageById: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Update stage
  async update(
    stage_id: number,
    body: StageUpdateDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const {
        name,
        description,
        capacity_min,
        capacity_max,
        branch_id,
        price,
      } = body;
      const findStage = await this.prismaService.stages.findUnique({
        where: { id: Number(stage_id) },
      });

      if (!findStage) {
        throw new NotFoundException('Không tìm thấy sảnh');
      }

      const findStageByName = await this.prismaService.stages.findFirst({
        where: { AND: [{ name }, { id: { not: Number(stage_id) } }] },
      });

      if (findStageByName) {
        throw new BadRequestException(
          'Tên sảnh đã tồn tại, vui lòng chọn tên khác',
        );
      }

      const updateData = {
        branch_id: Number(branch_id),
        name: name,
        description: description,
        capacity_min: Number(capacity_min),
        capacity_max: Number(capacity_max),
        images: findStage.images,
        price: Number(price),
      };

      if (files.images && files.images.length > 0) {
        const stagesImages =
          await this.cloudinaryService.uploadMultipleFilesToFolder(
            files.images,
            'joiepalace/stages',
          );

        if (stagesImages.length === 0) {
          throw new BadRequestException('Lỗi khi upload ảnh, vui lòng thử lại');
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
        {
          message: 'Cập nhật sảnh thành công',
          data: FormatReturnData(stagesRes, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ stages.service.ts -> update: ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Delete stage
  async delete(stage_id: number) {
    try {
      const findStage = await this.prismaService.stages.findUnique({
        where: { id: Number(stage_id) },
      });
      if (!findStage) {
        throw new NotFoundException('Không tìm thấy sảnh');
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }
}
