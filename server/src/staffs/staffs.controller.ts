import { StaffEntities } from './entities/staff.entities';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StaffsService } from './staffs.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateStaffDto } from './dto/create-staff.dto';
import { FilterDto } from 'helper/dto/Filter.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateAvatarStaffDto } from './dto/update-avatar-staff.dto';

@ApiTags('staffs')
@UseGuards(AuthGuard)
@Controller('staffs')
export class StaffsController {
  constructor(
    private readonly staffsService: StaffsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Add Staff
  @Post('create')
  @ApiOperation({ summary: 'Tạo nhân viên mới' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Tạo nhân viên thành công',
      data: {
        id: 'number',
        name: 'string',
        email: 'string',
        location_id: 'number',
        phone: 'string',
        payment_info: 'string',
        shift: 'string',
        avatar: 'string',
        created_at: 'string',
        updated_at: 'string',
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new HttpException(`Chỉ chấp nhận ảnh jpg, jpeg, png`, 400),
            false,
          );
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            return cb(
              new HttpException('Kích thước ảnh tối đa 5MB', 400),
              false,
            );
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  async addStaff(
    @Body() body: CreateStaffDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<StaffEntities | any> {
    if (file) {
      const avatar = await this.cloudinaryService.uploadFileToFolder(
        file,
        'joieplace/avatar',
      );
      body.avatar = avatar;
    } else {
      body.avatar = '';
    }
    return this.staffsService.addStaff(body);
  }

  // ! Get All Staff
  @Get('get-all')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy danh sách nhân viên thành công',
      data: [
        {
          id: 'number',
          name: 'string',
          email: 'string',
          location_id: 'number',
          phone: 'string',
          payment_info: 'string',
          shift: 'string',
          avatar: 'string',
          created_at: 'string',
          updated_at: 'string',
        },
      ],
      pagination: {
        total: 'number',
        currentPage: 'number',
        itemsPerPage: 'number',
        lastPage: 'number',
        prevPage: 'number',
        nextPage: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy nhân viên nào',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách nhân viên (trừ xóa tạm)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, example: '28-10-2004' })
  @ApiQuery({ name: 'endDate', required: false, example: '28-10-2004' })
  async getAllStaff(@Query() query: FilterDto): Promise<StaffEntities[] | any> {
    return this.staffsService.getAllStaff(query);
  }

  // ! Get All Staff Deleted
  @Get('get-all-deleted')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy danh sách nhân viên thành công',
      data: [
        {
          id: 'number',
          name: 'string',
          email: 'string',
          location_id: 'number',
          phone: 'string',
          payment_info: 'string',
          shift: 'string',
          avatar: 'string',
          created_at: 'string',
          updated_at: 'string',
        },
      ],
      pagination: {
        total: 'number',
        currentPage: 'number',
        itemsPerPage: 'number',
        lastPage: 'number',
        prevPage: 'number',
        nextPage: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy nhân viên nào',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách nhân viên đã xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, example: '28-10-2004' })
  @ApiQuery({ name: 'endDate', required: false, example: '28-10-2004' })
  async getAllStaffDeleted(
    @Query() query: FilterDto,
  ): Promise<StaffEntities[] | any> {
    return this.staffsService.getAllStaffDeleted(query);
  }

  // ! Get Staff By Id
  @Get('get/:staff_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy thông tin nhân viên thành công',
      data: {
        id: 'number',
        name: 'string',
        email: 'string',
        location_id: 'number',
        phone: 'string',
        payment_info: 'string',
        shift: 'string',
        avatar: 'string',
        created_at: 'string',
        updated_at: 'string',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy nhân viên nào',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin nhân viên theo id' })
  @ApiParam({ name: 'staff_id', required: true })
  async getStaffById(@Param() staff_id: number): Promise<StaffEntities | any> {
    return this.staffsService.getStaffById(staff_id);
  }

  // ! Update Staff
  @Post('update/:staff_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật thông tin nhân viên thành công',
      data: {
        id: 'number',
        name: 'string',
        email: 'string',
        location_id: 'number',
        phone: 'string',
        payment_info: 'string',
        shift: 'string',
        avatar: 'string',
        created_at: 'string',
        updated_at: 'string',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy nhân viên nào',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Cập nhật thông tin nhân viên' })
  async updateStaff(
    @Param('staff_id') staff_id: number,
    @Body() body: UpdateStaffDto,
  ) {
    return this.staffsService.updateStaff(staff_id, body);
  }

  // ! Update Avatar
  @Post('update-avatar/:staff_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật ảnh đại diện nhân viên thành công',
      data: {
        id: 'number',
        name: 'string',
        email: 'string',
        location_id: 'number',
        phone: 'string',
        payment_info: 'string',
        shift: 'string',
        avatar: 'string',
        created_at: 'string',
        updated_at: 'string',
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Cập nhật ảnh đại diện nhân viên' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new HttpException(`Chỉ chấp nhận ảnh jpg, jpeg, png`, 400),
            false,
          );
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            return cb(
              new HttpException('Kích thước ảnh tối đa 5MB', 400),
              false,
            );
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  async updateAvatar(
    @Param('staff_id') staff_id: number,
    @Body() body: UpdateAvatarStaffDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const avatar = await this.cloudinaryService.uploadFileToFolder(
        file,
        'joieplace/avatar',
      );
      body.avatar = avatar;
    } else {
      body.avatar = '';
    }
    return this.staffsService.updateAvatar(staff_id, body);
  }

  // ! Delete Staff
  @Delete('delete/:staff_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa tạm nhân viên thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy nhân viên nào',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Xóa tạm nhân viên' })
  @ApiParam({ name: 'staff_id', required: true })
  async deleteStaff(@Request() req: any, @Param() staff_id: number) {
    return this.staffsService.deleteStaff(req.user, staff_id);
  }

  // ! Restore Staff
  @Put('restore/:staff_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Khôi phục nhân viên thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy nhân viên nào',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Khôi phục nhân viên đã xóa tạm' })
  @ApiParam({ name: 'staff_id', required: true })
  async restoreStaff(@Param() staff_id: number) {
    return this.staffsService.restoreStaff(staff_id);
  }

  // ! Hard Delete Staff
  @Delete('destroy/:staff_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa vĩnh viễn nhân viên thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy nhân viên nào',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn nhân viên' })
  @ApiParam({ name: 'staff_id', required: true })
  async hardDeleteStaff(@Param() staff_id: number) {
    return this.staffsService.hardDeleteStaff(staff_id);
  }
}
