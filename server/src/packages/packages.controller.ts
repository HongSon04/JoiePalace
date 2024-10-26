import { find } from 'rxjs';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { isPublic } from 'decorator/auth.decorator';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  // ! Create package
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 6 }], {
      fileFilter: (req, file, cb) => {
        if (!file) {
          return cb(
            new BadRequestException('Không có tệp nào được tải lên'),
            false,
          );
        }
        const files = Array.isArray(file) ? file : [file];
        if (req.files && req.files.images && req.files.images.length >= 6) {
          return cb(
            new BadRequestException('Chỉ chấp nhận tối đa 6 ảnh'),
            false,
          );
        }
        for (const f of files) {
          if (!f.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(
              new BadRequestException('Chỉ chấp nhận ảnh jpg, jpeg, png'),
              false,
            );
          }
          if (f.size > 1024 * 1024 * 5) {
            return cb(
              new BadRequestException('Kích thước ảnh tối đa 5MB'),
              false,
            );
          }
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Body() createPackageDto: CreatePackageDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.packagesService.create(createPackageDto, files);
  }

  // ! Get all packages
  @Get('get-all')
  @isPublic()
  findAll() {
    return this.packagesService.findAll();
  }

  // ! Get All Packages deleted
  @Get('get-all-deleted')
  findAllDeleted() {
    return this.packagesService.findAllDeleted();
  }
  // ! Get package by ID
  @Get('get/:id')
  @isPublic()
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(+id);
  }

  // ! Get Package by slug
  @Get('get-by-slug/:slug')
  @isPublic()
  findBySlug(@Param('slug') slug: string) {
    return this.packagesService.findBySlug(slug);
  }

  // ! Update package
  @Patch('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 6 }], {
      fileFilter: (req, file, cb) => {
        const files = Array.isArray(file) ? file : [file];
        if (req.files && req.files.images && req.files.images.length >= 6) {
          return cb(
            new BadRequestException('Chỉ chấp nhận tối đa 6 ảnh'),
            false,
          );
        }
        for (const f of files) {
          if (!f.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(
              new BadRequestException('Chỉ chấp nhận ảnh jpg, jpeg, png'),
              false,
            );
          }
          if (f.size > 1024 * 1024 * 5) {
            return cb(
              new BadRequestException('Kích thước ảnh tối đa 5MB'),
              false,
            );
          }
        }
        cb(null, true);
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updatePackageDto: CreatePackageDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.packagesService.update(+id, updatePackageDto, files);
  }

  // ! Soft delete package
  @Delete('delete/:id')
  remove(@Request() req, @Param('id') id: string) {
    return this.packagesService.remove(+id, req.user);
  }

  // ! Restore package
  @Patch('restore/:id')
  restore(@Param('id') id: string) {
    return this.packagesService.restore(+id);
  }

  // ! Delete package
  @Delete('/destroy/:id')
  destroy(@Param('id') id: string) {
    return this.packagesService.destroy(+id);
  }
}
