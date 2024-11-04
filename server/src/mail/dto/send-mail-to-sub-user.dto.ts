import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class sendMailToSubcribeUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({
    message: 'is_receive không được để trống (User Cho phép nhận Mail)',
  })
  is_receive: boolean;

  @ApiProperty({ required: true })
  @IsNotEmpty({
    message:
      'is_receive_sales không được để trống (User Cho phép nhận Mail Sales)',
  })
  is_receive_sales: boolean;

  @ApiProperty({ required: true })
  @IsNotEmpty({
    message:
      'is_receive_blog không được để trống (User Cho phép nhận Mail Blog)',
  })
  is_receive_blog: boolean;
}
