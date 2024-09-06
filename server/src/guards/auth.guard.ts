import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        'Bạn cần phải đăng nhập để thực hiện thao tác này',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('ACCESS_SECRET_JWT'),
      });

      const user = await this.prismaService.users.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException(
          'Token không hợp lệ hoặc người dùng không tồn tại',
        );
      }

      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException(
        'Token Truy Cập không hợp lệ hoặc hết thời gian sử dụng',
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
