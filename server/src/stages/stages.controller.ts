import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { StagesService } from './stages.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { StageDto } from './dto/stage.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StageUpdateDto } from './dto/stage-update.dto';

@ApiTags('stages')
@Controller('stages')
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  // ! Create A New Stage
  @Post('create')
  @ApiOperation({ summary: 'Tạo sảnh mới' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new HttpException(
              'Chỉ chấp nhận ảnh jpg, jpeg, png',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else if (file.size > 1024 * 1024 * 5) {
          return cb(
            new HttpException(
              'Kích thước ảnh tối đa 5MB',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async create(
    @Body() body: StageDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return await this.stagesService.create(body, files);
  }

  // ! Get All Stages
  @Get('get-all')
  @ApiOperation({ summary: 'Lấy tất cả sảnh theo chi nhánh' })
  async getAll(@Query('location_id') location_id: number) {
    return await this.stagesService.getAll(location_id);
  }

  // ! Get Stage By ID
  @ApiParam({ name: 'stage_id', required: true })
  @ApiOperation({ summary: 'Lấy thông tin sảnh theo ID' })
  @Get('get/:stage_id')
  async getStageById(@Param('stage_id') stage_id: number) {
    return await this.stagesService.getStageById(stage_id);
  }

  // ! Update Stage
  @Post('update/:stage_id')
  @ApiOperation({ summary: 'Cập nhật thông tin sảnh' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new HttpException(
              'Chỉ chấp nhận ảnh jpg, jpeg, png',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else if (file.size > 1024 * 1024 * 5) {
          return cb(
            new HttpException(
              'Kích thước ảnh tối đa 5MB',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async update(
    @Param('stage_id') stage_id: number,
    @Body() body: StageUpdateDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return await this.stagesService.update(stage_id, body, files);
  }

  // ! Delete Stage
  @Delete('destroy/:stage_id')
  @ApiOperation({ summary: 'Xóa sảnh vĩnh viễn' })
  @ApiParam({ name: 'stage_id', required: true })
  async delete(@Param('stage_id') stage_id: number) {
    return await this.stagesService.delete(stage_id);
  }
}
