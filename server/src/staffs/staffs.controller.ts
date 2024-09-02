import { StaffEntities } from './entities/staff.entities';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateStaffDto } from './dto/create-staff.dto';
import { FilterDto } from 'helper/dto/Filter.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateAvatarStaffDto } from './dto/update-avatar-staff.dto';
import { query } from 'express';
import { ChangeLocationDto } from './dto/change-location.dto';

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
  @ApiOperation({ summary: 'Lấy danh sách nhân viên (trừ xóa tạm)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getAllStaff(@Query() query: FilterDto): Promise<StaffEntities[] | any> {
    return this.staffsService.getAllStaff(query);
  }

  // ! Get All Staff Deleted
  @Get('get-all-deleted')
  @ApiOperation({ summary: 'Lấy danh sách nhân viên đã xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getAllStaffDeleted(
    @Query() query: FilterDto,
  ): Promise<StaffEntities[] | any> {
    return this.staffsService.getAllStaffDeleted(query);
  }

  // ! Get Staff By Id
  @Get('get/:staff_id')
  @ApiOperation({ summary: 'Lấy thông tin nhân viên theo id' })
  @ApiParam({ name: 'staff_id', required: true })
  async getStaffById(@Param() staff_id: number): Promise<StaffEntities | any> {
    return this.staffsService.getStaffById(staff_id);
  }

  // ! Update Staff
  @Post('update/:staff_id')
  @ApiOperation({ summary: 'Cập nhật thông tin nhân viên' })
  async updateStaff(
    @Param('staff_id') staff_id: number,
    @Body() body: UpdateStaffDto,
  ) {
    return this.staffsService.updateStaff(staff_id, body);
  }

  // ! Update Avatar
  @Post('update-avatar/:staff_id')
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
  @ApiOperation({ summary: 'Xóa tạm nhân viên' })
  @ApiParam({ name: 'staff_id', required: true })
  async deleteStaff(@Request() req: any, @Param() staff_id: number) {
    return this.staffsService.deleteStaff(req.user, staff_id);
  }

  // ! Restore Staff
  @Post('restore/:staff_id')
  @ApiOperation({ summary: 'Khôi phục nhân viên đã xóa tạm' })
  @ApiParam({ name: 'staff_id', required: true })
  async restoreStaff(@Param() staff_id: number) {
    return this.staffsService.restoreStaff(staff_id);
  }

  // ! Hard Delete Staff
  @Delete('destroy/:staff_id')
  @ApiOperation({ summary: 'Xóa vĩnh viễn nhân viên' })
  @ApiParam({ name: 'staff_id', required: true })
  async hardDeleteStaff(@Param() staff_id: number) {
    return this.staffsService.hardDeleteStaff(staff_id);
  }
}
