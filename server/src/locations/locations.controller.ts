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
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationEntity } from './entities/location.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  CreateLocationDto,
  ImageUploadLocationDto,
} from './dto/create-location.dto';
import { FilterDto } from 'helper/dto/Filter.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateLocationDto } from './dto/update-location.dto';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DeleteImageDto } from './dto/delete-image.dto';

@ApiTags('location')
@UseGuards(AuthGuard)
@Controller('location')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create A New Location
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 5 },
        { name: 'slogan_images', maxCount: 5 },
        { name: 'diagram_images', maxCount: 5 },
        { name: 'equipment_images', maxCount: 5 },
        { name: 'space_images', maxCount: 5 },
      ],
      {
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
          }
          cb(null, true);
        },
      },
    ),
  )
  async createLocation(
    @Body() location: CreateLocationDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      slogan_images?: Express.Multer.File[];
      diagram_images?: Express.Multer.File[];
      equipment_images?: Express.Multer.File[];
      space_images?: Express.Multer.File[];
    },
  ): Promise<LocationEntity | any> {
    return this.locationsService.createLocation(
      location,
      files as ImageUploadLocationDto,
    );
  }

  // ! Get All Locations
  @Get('get-all')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getAllLocations(@Query() query: FilterDto): Promise<any> {
    return this.locationsService.getAllLocations(query);
  }

  // ! Get All Locations (Deleted)
  @Get('get-all-deleted')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getAllDeletedLocations(@Query() query: FilterDto): Promise<any> {
    return this.locationsService.getAllDeletedLocations(query);
  }

  // ! Get Location By Id
  @Get('get/:location_id')
  async getLocationById(
    @Param('location_id') id: number,
  ): Promise<LocationEntity | any> {
    return this.locationsService.getLocationById(id);
  }

  // ! Update Location Info
  @Patch('update/:location_id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 5 },
        { name: 'slogan_images', maxCount: 5 },
        { name: 'diagram_images', maxCount: 5 },
        { name: 'equipment_images', maxCount: 5 },
        { name: 'space_images', maxCount: 5 },
      ],
      {
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
          }
          cb(null, true);
        },
      },
    ),
  )
  async updateLocation(
    @Param('location_id') location_id: number,
    @Body() location: UpdateLocationDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      slogan_images?: Express.Multer.File[];
      diagram_images?: Express.Multer.File[];
      equipment_images?: Express.Multer.File[];
      space_images?: Express.Multer.File[];
    },
  ): Promise<LocationEntity | any> {
    return this.locationsService.updateLocation(
      location_id,
      location,
      files as ImageUploadLocationDto,
    );
  }

  // ! Soft Delete Location
  @Delete('soft-delete/:location_id')
  async softDeleteLocation(
    @Request() req,
    @Param('location_id') id: number,
  ): Promise<any> {
    return this.locationsService.softDeleteLocation(req.user, id);
  }

  // ! Restore Location
  @Post('restore/:location_id')
  async restoreLocation(@Param('location_id') id: number): Promise<any> {
    return this.locationsService.restoreLocation(id);
  }

  // ! Hard Delete Location
  @Delete('hard-delete/:location_id')
  async hardDeleteLocation(@Param('location_id') id: number): Promise<any> {
    return this.locationsService.hardDeleteLocation(id);
  }

  // ! Delete Image By Url
  @Delete('delete-image')
  async deleteImageByUrl(@Body() image_url: DeleteImageDto): Promise<any> {
    return this.locationsService.deleteImageByUrl(image_url);
  }
}
