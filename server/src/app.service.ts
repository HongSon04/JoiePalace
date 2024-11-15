import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async confirmRegister(token: string, email: string) {
    try {
      const [findUser, FindTokens] = await Promise.all([
        this.prismaService.users.findUnique({
          where: {
            email,
          },
        }),
        this.prismaService.verify_tokens.findFirst({
          where: {
            token,
            email,
          },
        }),
      ]);

      if (!findUser) {
        throw new HttpException(
          'Yêu cầu xác thực không có hoặc đã hết hạn!',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!FindTokens) {
        throw new HttpException(
          'Yêu cầu xác thực không có hoặc đã hết hạn!',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prismaService.users.update({
        where: {
          email,
        },
        data: {
          verify_at: new Date(),
        },
      });

      await this.prismaService.verify_tokens.deleteMany({
        where: {
          token,
          email,
        },
      });

      throw new HttpException('Xác thực người dùng thành công!', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ AppService->confirmRegister', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  async getSecretKey() {
    return {
      google_id: this.configService.get('GOOGLE_ID'),
      google_secret: this.configService.get('GOOGLE_SECRET'),
      next_auth_secret: this.configService.get('NEXTAUTH_SECRET'),
    };
  }
}
