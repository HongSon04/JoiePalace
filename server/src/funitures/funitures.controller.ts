import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFiles,
  Query,
  Request,
} from '@nestjs/common';
import { FunituresService } from './funitures.service';
import { CreateFunitureDto, ImageFunitureDto } from './dto/create-funiture.dto';
import { UpdateFunitureDto } from './dto/update-funiture.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilterFunitureDto } from './dto/filter-funiture.dto';

@Controller('funitures')
export class FunituresController {
  constructor(private readonly funituresService: FunituresService) {}

  // ! Create funiture
  @Post('create')
  @ApiOperation({ summary: 'Tạo nội thất' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
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
  create(
    @Body() createFunitureDto: CreateFunitureDto,
    @UploadedFiles() files: { images: ImageFunitureDto },
  ) {
    return this.funituresService.create(createFunitureDto, files);
  }

  // ! Get all funitures
  @Get('get-all')
  @ApiOperation({ summary: 'Lấy danh sách nội thất' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'type', required: false })
  findAll(@Query() query: FilterFunitureDto) {
    return this.funituresService.findAll(query);
  }

  // ! Get All funitures by Deleted
  @Get('get-all-deleted')
  @ApiOperation({ summary: 'Lấy danh sách nội thất đã xóa' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  findAllDeleted(@Query() query: FilterFunitureDto) {
    return this.funituresService.findAllDeleted(query);
  }

  // ! Get One funiture by ID
  @Get('get/:id')
  findOne(@Param('id') id: number) {
    return this.funituresService.findOne(id);
  }

  // ! Get One funiture by Slug
  @Get('get-slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.funituresService.findOneBySlug(slug);
  }

  // ! Update funiture
  @Patch('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
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
  update(
    @Param('id') id: number,
    @Body() updateFunitureDto: UpdateFunitureDto,
    @UploadedFiles() files: { images: ImageFunitureDto },
  ) {
    return this.funituresService.update(id, updateFunitureDto, files);
  }

  // ! Soft delete funiture
  @Delete('delete/:id')
  delete(@Request() req, @Param('id') id: number) {
    return this.funituresService.delete(req.user, id);
  }

  // ! Restore funiture
  @Patch('restore/:id')
  restore(@Param('id') id: number) {
    return this.funituresService.restore(id);
  }

  // ! Hard delete funiture
  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.funituresService.destroy(id);
  }
}
