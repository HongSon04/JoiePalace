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
import { DecorsService } from './decors.service';
import { CreateDecorDto, ImageDecorDto } from './dto/create-decor.dto';
import { UpdateDecorDto } from './dto/update-decor.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';

@ApiTags('decors')
@Controller('decors')
export class DecorsController {
  constructor(private readonly decorsService: DecorsService) {}

  // ! Create Decor
  @Post('create')
  @ApiOperation({ summary: 'Tạo trang trí' })
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
    @Body() createDecorDto: CreateDecorDto,
    @UploadedFiles() files: ImageDecorDto,
  ) {
    return this.decorsService.create(createDecorDto, files);
  }

  // ! Get All Decors
  @Get('get-all')
  @ApiOperation({ summary: 'Lấy danh sách trang trí' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  findAll(@Query() query: FilterPriceDto) {
    return this.decorsService.findAll(query);
  }

  // ! Get All Deleted Decors
  @Get('get-all-deleted')
  @ApiOperation({ summary: 'Lấy danh sách trang trí đã xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  findAllDeleted(@Query() query: FilterPriceDto) {
    return this.decorsService.findAllDeleted(query);
  }

  // ! Get Decor By ID
  @Get('get/:decor_id')
  @ApiOperation({ summary: 'Lấy thông tin trang trí' })
  findOne(@Param('decor_id') id: number) {
    return this.decorsService.findOne(id);
  }

  // ! Get Decor By Slug
  @Get('get-by-slug/:slug')
  @ApiOperation({ summary: 'Lấy thông tin trang trí theo slug' })
  findOneBySlug(@Param('slug') slug: string) {
    return this.decorsService.findOneBySlug(slug);
  }

  // ! Update Decor
  @Patch('update/:decor_id')
  @ApiOperation({ summary: 'Cập nhật trang trí' })
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
    @Param('decor_id') id: number,
    @Body() updateDecorDto: UpdateDecorDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.decorsService.update(id, updateDecorDto, files);
  }

  // ! Soft Delete Decor
  @Delete('delete/:decor_id')
  @ApiOperation({ summary: 'Xóa trang trí' })
  remove(@Request() req, @Param('decor_id') id: number) {
    return this.decorsService.delete(req.user, id);
  }

  // ! Restore Decor
  @Patch('restore/:decor_id')
  @ApiOperation({ summary: 'Khôi phục trang trí đã xóa' })
  restore(@Param('decor_id') id: number) {
    return this.decorsService.restore(id);
  }

  // ! Hard Delete Decor
  @Delete('destroy/:decor_id')
  @ApiOperation({ summary: 'Xóa vĩnh viễn trang trí' })
  destroy(@Param('decor_id') id: number) {
    return this.decorsService.destroy(id);
  }
}
