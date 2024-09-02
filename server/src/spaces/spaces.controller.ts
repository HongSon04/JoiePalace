import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateSpaceDto } from './dto/create-space.dto';
import { updateSpaceDto } from './dto/update-space.dto';
import { DeleteImageDto } from './dto/upload-image.dto';

@ApiTags('spaces')
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  // ! Create A New Space
  @Post('create')
  @ApiOperation({ summary: 'Tạo không gian mới' })
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
  async createSpace(
    @Body() body: CreateSpaceDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ): Promise<string> {
    return this.spacesService.createSpace(body, files);
  }

  // ! Find Spaces By Location ID
  @Get('find-by-location/:location_id')
  @ApiOperation({ summary: 'Tìm kiếm không gian theo ID địa điểm' })
  async findSpacesByLocation(@Param('location_id') location_id: number) {
    return this.spacesService.findSpacesByLocation(location_id);
  }

  // ! Find Space By ID
  @Get('find/:space_id')
  @ApiOperation({ summary: 'Tìm kiếm không gian theo ID' })
  async findSpaceById(@Param('space_id') space_id: number) {
    return this.spacesService.findSpaceById(space_id);
  }

  // ! Find Space By Slug
  @Get('get-slug/:slug')
  @ApiOperation({ summary: 'Tìm kiếm không gian theo slug' })
  async findSpaceBySlug(@Param('slug') slug: string) {
    return this.spacesService.findSpaceBySlug(slug);
  }

  // ? Update Space
  @Patch('update/:space_id')
  @ApiOperation({ summary: 'Cập nhật thông tin không gian' })
  async updateSpace(
    @Param('space_id') space_id: number,
    @Body() body: updateSpaceDto,
  ): Promise<string> {
    return this.spacesService.updateSpace(space_id, body);
  }

  // ? Upload Space Images
  @Post('upload-images/:space_id')
  @ApiOperation({ summary: 'Tải ảnh lên không gian' })
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
  async uploadImages(
    @Param('space_id') space_id: number,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ): Promise<string> {
    return this.spacesService.uploadImages(space_id, files as any);
  }

  // ! Delete Space Images
  @Delete('delete-images/:space_id')
  @ApiOperation({ summary: 'Xóa ảnh không gian' })
  async deleteImages(
    @Param('space_id') space_id: number,
    @Body() body: DeleteImageDto,
  ): Promise<string> {
    return this.spacesService.deleteImages(space_id, body);
  }

  // ! Delete Space
  @Delete('destroy/:space_id')
  @ApiOperation({ summary: 'Xóa không gian vĩnh viễn' })
  async deleteSpace(@Param('space_id') space_id: number): Promise<string> {
    return this.spacesService.deleteSpace(space_id);
  }
}
