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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StageDto } from './dto/stage.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StageUpdateDto } from './dto/stage-update.dto';

@ApiTags('stages')
@Controller('stages')
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  // ! Create A New Stage
  @Post('create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Tạo sảnh thành công',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        images: 'object',
        location_id: 'number',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Chỉ chấp nhận ảnh jpg, jpeg, png',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên sảnh đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy tất cả sảnh thành công',
      data: [
        {
          id: 'number',
          name: 'string',
          slug: 'string',
          description: 'string',
          images: 'object',
          location_id: 'number',
          created_at: 'date',
          updated_at: 'date',
        },
      ],
      pagination: {
        total: 'number',
        currentPages: 'number',
        itemsPerPage: 'number',
        lastPage: 'number',
        nextPage: 'number',
        prevPage: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy sảnh nào',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Lấy tất cả sảnh theo chi nhánh' })
  async getAll(@Query('location_id') location_id: number) {
    return await this.stagesService.getAll(location_id);
  }

  // ! Get Stage By ID
  @Get('get/:stage_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy thông tin sảnh thành công',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        images: 'object',
        location_id: 'number',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy sảnh',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiParam({ name: 'stage_id', required: true })
  @ApiOperation({ summary: 'Lấy thông tin sảnh theo ID' })
  async getStageById(@Param('stage_id') stage_id: number) {
    return await this.stagesService.getStageById(stage_id);
  }

  // ! Update Stage
  @Post('update/:stage_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật thông tin sảnh thành công',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        images: 'object',
        location_id: 'number',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Chỉ chấp nhận ảnh jpg, jpeg, png',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên sảnh đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy sảnh',
    },
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa sảnh thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy sảnh',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Xóa sảnh vĩnh viễn' })
  @ApiParam({ name: 'stage_id', required: true })
  async delete(@Param('stage_id') stage_id: number) {
    return await this.stagesService.delete(stage_id);
  }
}
