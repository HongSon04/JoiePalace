import slugify from 'slugify';

export const MakeSlugger = (str: string): string => {
  return slugify(str, {
    replacement: '-', // ? Thay thế khoảng trắng bằng dấu gạch ngang
    remove: undefined, // ? Loại bỏ các ký tự không mong muốn
    lower: true, // ? Chuyển tất cả ký tự thành chữ thường
    strict: false, // ? Loại bỏ ký tự không hợp lệ từ URL
    locale: 'vi', // ? Chuyển đổi ký tự tiếng Việt
    trim: true, // ? Loại bỏ khoảng trắng ở đầu và cuối chuỗi
  });
};
