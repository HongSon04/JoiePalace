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
  Put,
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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('location')
@UseGuards(AuthGuard)
@Controller('location')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // ! Create A New Location
  @Post('create')
  @ApiOperation({ summary: 'Tạo chi nhánh mới' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Thêm địa điểm thành công',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        address: 'string',
        phone: 'string',
        email: 'string',
        rate: 'number',
        images: ['string', 'string'],
        created_at: 'date',
        updated_at: 'date',
        location_detail: {
          id: 'number',
          location_id: 'number',
          slogan: 'string',
          slogan_description: 'string',
          slogan_images: ['string', 'string'],
          diagram_description: 'string',
          diagram_images: ['string', 'string'],
          equipment_description: 'string',
          equipment_images: ['string', 'string'],
          created_at: 'date',
          updated_at: 'date',
        },
        space: [
          {
            id: 'number',
            location_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên chi nhánh đã tồn tại !',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy ảnh nào được tải lên !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          name: 'string',
          slug: 'string',
          address: 'string',
          phone: 'string',
          email: 'string',
          rate: 'number',
          images: ['string', 'string'],
          created_at: 'date',
          updated_at: 'date',
          location_detail: {
            id: 'number',
            location_id: 'number',
            slogan: 'string',
            slogan_description: 'string',
            slogan_images: ['string', 'string'],
            diagram_description: 'string',
            diagram_images: ['string', 'string'],
            equipment_description: 'string',
            equipment_images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
          space: [
            {
              id: 'number',
              location_id: 'number',
              name: 'string',
              slug: 'string',
              description: 'string',
              images: ['string', 'string'],
              created_at: 'date',
              updated_at: 'date',
            },
          ],
          stages: [
            {
              id: 'number',
              location_id: 'number',
              name: 'string',
              slug: 'string',
              description: 'string',
              images: ['string', 'string'],
              created_at: 'date',
              updated_at: 'date',
            },
          ],
        },
      ],
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        totalItems: 'number',
        totalPages: 'number',
      },
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách tất cả chi nhánh (trừ đã xóa tạm)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, example: '28-10-2004' })
  @ApiQuery({ name: 'endDate', required: false, example: '28-10-2004' })
  async getAllLocations(@Query() query: FilterDto): Promise<any> {
    return this.locationsService.getAllLocations(query);
  }

  // ! Get All Locations (Deleted)
  @Get('get-all-deleted')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          name: 'string',
          slug: 'string',
          address: 'string',
          phone: 'string',
          email: 'string',
          rate: 'number',
          images: ['string', 'string'],
          created_at: 'date',
          updated_at: 'date',
          location_detail: {
            id: 'number',
            location_id: 'number',
            slogan: 'string',
            slogan_description: 'string',
            slogan_images: ['string', 'string'],
            diagram_description: 'string',
            diagram_images: ['string', 'string'],
            equipment_description: 'string',
            equipment_images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
          space: [
            {
              id: 'number',
              location_id: 'number',
              name: 'string',
              slug: 'string',
              description: 'string',
              images: ['string', 'string'],
              created_at: 'date',
              updated_at: 'date',
            },
          ],
          stages: [
            {
              id: 'number',
              location_id: 'number',
              name: 'string',
              slug: 'string',
              description: 'string',
              images: ['string', 'string'],
              created_at: 'date',
              updated_at: 'date',
            },
          ],
        },
      ],
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        totalItems: 'number',
        totalPages: 'number',
      },
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách chi nhánh đã xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, example: '28-10-2004' })
  @ApiQuery({ name: 'endDate', required: false, example: '28-10-2004' })
  async getAllDeletedLocations(@Query() query: FilterDto): Promise<any> {
    return this.locationsService.getAllDeletedLocations(query);
  }

  // ! Get Location By Id
  @Get('get/:location_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        address: 'string',
        phone: 'string',
        email: 'string',
        rate: 'number',
        images: ['string', 'string'],
        created_at: 'date',
        updated_at: 'date',
        location_detail: {
          id: 'number',
          location_id: 'number',
          slogan: 'string',
          slogan_description: 'string',
          slogan_images: ['string', 'string'],
          diagram_description: 'string',
          diagram_images: ['string', 'string'],
          equipment_description: 'string',
          equipment_images: ['string', 'string'],
          created_at: 'date',
          updated_at: 'date',
        },
        space: [
          {
            id: 'number',
            location_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
        ],
        stages: [
          {
            id: 'number',
            location_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy chi nhánh !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin chi nhánh theo ID' })
  async getLocationById(
    @Param('location_id') id: number,
  ): Promise<LocationEntity | any> {
    return this.locationsService.getLocationById(id);
  }

  // ! Get Location By Slug
  @Get('get-by-slug/:location_slug')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        address: 'string',
        phone: 'string',
        email: 'string',
        rate: 'number',
        images: ['string', 'string'],
        created_at: 'date',
        updated_at: 'date',
        location_detail: {
          id: 'number',
          location_id: 'number',
          slogan: 'string',
          slogan_description: 'string',
          slogan_images: ['string', 'string'],
          diagram_description: 'string',
          diagram_images: ['string', 'string'],
          equipment_description: 'string',
          equipment_images: ['string', 'string'],
          created_at: 'date',
          updated_at: 'date',
        },
        space: [
          {
            id: 'number',
            location_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
        ],
        stages: [
          {
            id: 'number',
            location_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy chi nhánh !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin chi nhánh theo Slug' })
  async getLocationBySlug(
    @Param('location_slug') slug: string,
  ): Promise<LocationEntity | any> {
    return this.locationsService.getLocationBySlug(slug);
  }

  // ! Update Location Info
  @Patch('update/:location_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật thông tin chi nhánh thành công !',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        address: 'string',
        phone: 'string',
        email: 'string',
        rate: 'number',
        images: ['string', 'string'],
        created_at: 'date',
        updated_at: 'date',
        location_detail: {
          id: 'number',
          location_id: 'number',
          slogan: 'string',
          slogan_description: 'string',
          slogan_images: ['string', 'string'],
          diagram_description: 'string',
          diagram_images: ['string', 'string'],
          equipment_description: 'string',
          equipment_images: ['string', 'string'],
          created_at: 'date',
          updated_at: 'date',
        },
        space: [
          {
            id: 'number',
            location_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
        ],
        stages: [
          {
            id: 'number',
            location_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên chi nhánh đã tồn tại !',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy ảnh nào được tải lên !',
    },
  })
  @ApiOperation({ summary: 'Cập nhật thông tin chi nhánh' })
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
  @Delete('delete/:location_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa chi nhánh thành công !',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy chi nhánh !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Xóa tạm chi nhánh' })
  async softDeleteLocation(
    @Request() req,
    @Param('location_id') id: number,
  ): Promise<any> {
    return this.locationsService.softDeleteLocation(req.user, id);
  }

  // ! Restore Location
  @Put('restore/:location_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Khôi phục chi nhánh thành công !',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy chi nhánh !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Khôi phục chi nhánh đã xóa tạm' })
  async restoreLocation(@Param('location_id') id: number): Promise<any> {
    return this.locationsService.restoreLocation(id);
  }

  // ! Hard Delete Location
  @Delete('destroy/:location_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa vĩnh viễn chi nhánh thành công !',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy chi nhánh !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn chi nhánh' })
  async hardDeleteLocation(@Param('location_id') id: number): Promise<any> {
    return this.locationsService.hardDeleteLocation(id);
  }

  // ! Delete Image By Url
  /* @Delete('delete-image')
  @ApiOperation({ summary: 'Xóa ảnh theo URL' })
  async deleteImageByUrl(@Body() image_url: DeleteImageDto): Promise<any> {
    return this.locationsService.deleteImageByUrl(image_url);
  } */
}
