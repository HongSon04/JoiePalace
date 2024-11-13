import { HttpException, InternalServerErrorException } from '@nestjs/common';

export function handleErrorHelper(_error: any, _location: string) {
  if (_error instanceof HttpException) {
    throw _error;
  }
  console.log(`Lỗi từ ${_location}:`, _error);
  throw new InternalServerErrorException({
    message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
    error: _error.message,
  });
}
