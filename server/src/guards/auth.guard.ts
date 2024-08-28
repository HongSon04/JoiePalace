import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        message: 'Bạn cần phải đăng nhập để thực hiện thao tác này',
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('ACCESS_SECRET_JWT'),
      });
      const checkUser = await this.prismaService.users.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!checkUser) {
        throw new UnauthorizedException({ message: 'Token không hợp lệ' });
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException({
        message: 'Token Truy Cập không hợp lệ hoặc hết thời gian sử dụng',
      });
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
