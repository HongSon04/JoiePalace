import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
const prisma = new PrismaClient();

const MakeSlugger = (str: string): string => {
  return slugify(str, {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: false,
    locale: 'vi',
    trim: true,
  });
};

const products = [
  {
    name: 'Bún riêu',
    category_id: 1,
    slug: MakeSlugger('Bún riêu'),
    description: 'Món ăn ngon',
    short_description: 'Món ăn ngon',
    price: 20000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bún chả',
    category_id: 1,
    slug: MakeSlugger('Bún chả'),
    description: 'Món ăn ngon',
    short_description: 'Món ăn ngon',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bún đậu',
    category_id: 1,
    slug: MakeSlugger('Bún đậu'),
    description: 'Món ăn ngon',
    short_description: 'Món ăn ngon',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bún bò',
    category_id: 1,
    slug: MakeSlugger('Bún bò'),
    description: 'Món ăn ngon',
    short_description: 'Món ăn ngon',
    price: 50000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bún mắm',
    category_id: 1,
    slug: MakeSlugger('Bún mắm'),
    description: 'Món ăn ngon',
    short_description: 'Món ăn ngon',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Phở bò',
    category_id: 1,
    slug: MakeSlugger('Phở bò'),
    description: 'Món ăn truyền thống',
    short_description: 'Món ăn truyền thống',
    price: 70000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Cháo lòng',
    category_id: 1,
    slug: MakeSlugger('Cháo lòng'),
    description: 'Món ăn bổ dưỡng',
    short_description: 'Món ăn bổ dưỡng',
    price: 25000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Hủ tiếu',
    category_id: 1,
    slug: MakeSlugger('Hủ tiếu'),
    description: 'Món ăn miền Nam',
    short_description: 'Món ăn miền Nam',
    price: 45000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Cao lầu',
    category_id: 1,
    slug: MakeSlugger('Cao lầu'),
    description: 'Món ăn Hội An',
    short_description: 'Món ăn Hội An',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Gỏi cuốn',
    category_id: 1,
    slug: MakeSlugger('Gỏi cuốn'),
    description: 'Món ăn nhẹ',
    short_description: 'Món ăn nhẹ',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },

  {
    name: 'Bánh mì',
    category_id: 1,
    slug: MakeSlugger('Bánh mì'),
    description: 'Món ăn phổ biến',
    short_description: 'Món ăn phổ biến',
    price: 15000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Mì Quảng',
    category_id: 1,
    slug: MakeSlugger('Mì Quảng'),
    description: 'Món ăn đặc sản miền Trung',
    short_description: 'Món ăn đặc sản miền Trung',
    price: 70000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bánh xèo',
    category_id: 1,
    slug: MakeSlugger('Bánh xèo'),
    description: 'Món ăn chiên giòn',
    short_description: 'Món ăn chiên giòn',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bò lúc lắc',
    category_id: 1,
    slug: MakeSlugger('Bò lúc lắc'),
    description: 'Món ăn ngon miệng',
    short_description: 'Món ăn ngon miệng',
    price: 80000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Mạch nha',
    category_id: 1,
    slug: MakeSlugger('Mạch nha'),
    description: 'Món ăn lạ',
    short_description: 'Món ăn lạ',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bánh chưng',
    slug: MakeSlugger('Bánh chưng'),
    description: 'Món ăn truyền thống ngày Tết',
    short_description: 'Món ăn truyền thống',
    price: 45000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bánh tét',
    slug: MakeSlugger('Bánh tét'),
    description: 'Món ăn ngon ngày Tết',
    short_description: 'Món ăn ngon',
    price: 48000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Chả giò',
    slug: MakeSlugger('Chả giò'),
    description: 'Món ăn chiên giòn',
    short_description: 'Món ăn chiên giòn',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Cà ri',
    slug: MakeSlugger('Cà ri'),
    description: 'Món ăn hấp dẫn',
    short_description: 'Món ăn hấp dẫn',
    price: 70000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Gà rán',
    slug: MakeSlugger('Gà rán'),
    description: 'Món ăn hấp dẫn',
    short_description: 'Món ăn hấp dẫn',
    price: 80000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Nem nướng',
    slug: MakeSlugger('Nem nướng'),
    description: 'Món ăn đặc sản',
    short_description: 'Món ăn đặc sản',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Cá kho tộ',
    slug: MakeSlugger('Cá kho tộ'),
    description: 'Món ăn đậm đà',
    short_description: 'Món ăn đậm đà',
    price: 75000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Mực xào',
    slug: MakeSlugger('Mực xào'),
    description: 'Món ăn biển',
    short_description: 'Món ăn biển',
    price: 90000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bí đỏ xào thịt',
    slug: MakeSlugger('Bí đỏ xào thịt'),
    description: 'Món ăn dinh dưỡng',
    short_description: 'Món ăn dinh dưỡng',
    price: 35000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Đậu hũ chiên',
    slug: MakeSlugger('Đậu hũ chiên'),
    description: 'Món chay ngon',
    short_description: 'Món chay ngon',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Sò điệp nướng',
    slug: MakeSlugger('Sò điệp nướng'),
    description: 'Món ăn ngon miệng',
    short_description: 'Món ăn ngon miệng',
    price: 100000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bánh tráng cuốn',
    slug: MakeSlugger('Bánh tráng cuốn'),
    description: 'Món ăn vặt',
    short_description: 'Món ăn vặt',
    price: 20000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Salat trộn',
    slug: MakeSlugger('Salat trộn'),
    description: 'Món ăn nhẹ',
    short_description: 'Món ăn nhẹ',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bánh canh',
    slug: MakeSlugger('Bánh canh'),
    description: 'Món ăn miền Trung',
    short_description: 'Món ăn miền Trung',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Súp lơ xào tỏi',
    slug: MakeSlugger('Súp lơ xào tỏi'),
    description: 'Món ăn dinh dưỡng',
    short_description: 'Món ăn dinh dưỡng',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bánh khoai lang',
    slug: MakeSlugger('Bánh khoai lang'),
    description: 'Món ăn vặt',
    short_description: 'Món ăn vặt',
    price: 20000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Mứt dừa',
    slug: MakeSlugger('Mứt dừa'),
    description: 'Món ăn ngày Tết',
    short_description: 'Món ăn ngày Tết',
    price: 15000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Thịt kho',
    slug: MakeSlugger('Thịt kho'),
    description: 'Món ăn truyền thống',
    short_description: 'Món ăn truyền thống',
    price: 70000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Chè đậu xanh',
    slug: MakeSlugger('Chè đậu xanh'),
    description: 'Món tráng miệng',
    short_description: 'Món tráng miệng',
    price: 20000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Chè bà ba',
    slug: MakeSlugger('Chè bà ba'),
    description: 'Món tráng miệng ngon',
    short_description: 'Món tráng miệng ngon',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Món xào chua ngọt',
    slug: MakeSlugger('Món xào chua ngọt'),
    description: 'Món ăn hấp dẫn',
    short_description: 'Món ăn hấp dẫn',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzungthltxdb1.jpg',
    ],
  },
  {
    name: 'Thịt lợn xào',
    slug: MakeSlugger('Thịt lợn xào'),
    description: 'Món ăn ngon',
    short_description: 'Món ăn ngon',
    price: 55000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Cá chiên xù',
    slug: MakeSlugger('Cá chiên xù'),
    description: 'Món ăn hấp dẫn',
    short_description: 'Món ăn hấp dẫn',
    price: 80000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bún nước',
    slug: MakeSlugger('Bún nước'),
    description: 'Món ăn miền Bắc',
    short_description: 'Món ăn miền Bắc',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Pizza',
    slug: MakeSlugger('Pizza'),
    description: 'Món ăn nổi tiếng của Ý',
    short_description: 'Món ăn nổi tiếng',
    price: 80000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Pasta',
    slug: MakeSlugger('Pasta'),
    description: 'Món ăn Ý thể hiện sự tinh tế',
    short_description: 'Món ăn Ý',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Sushi',
    slug: MakeSlugger('Sushi'),
    description: 'Món ăn Nhật Bản nổi tiếng',
    short_description: 'Món ăn Nhật Bản',
    price: 120000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Tacos',
    slug: MakeSlugger('Tacos'),
    description: 'Món ăn Mexico truyền thống',
    short_description: 'Món ăn Mexico',
    price: 50000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Falafel',
    slug: MakeSlugger('Falafel'),
    description: 'Món ăn chay của Trung Đông',
    short_description: 'Món ăn chay',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Kebab',
    slug: MakeSlugger('Kebab'),
    description: 'Món nướng của các quốc gia Trung Đông',
    short_description: 'Món nướng',
    price: 70000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Paella',
    slug: MakeSlugger('Paella'),
    description: 'Món ăn truyền thống của Tây Ban Nha',
    short_description: 'Món ăn Tây Ban Nha',
    price: 90000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Curry',
    slug: MakeSlugger('Curry'),
    description: 'Món ăn đa dạng của Ấn Độ',
    short_description: 'Món ăn Ấn Độ',
    price: 85000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Chowder',
    slug: MakeSlugger('Chowder'),
    description: 'Súp kem hải sản của Mỹ',
    short_description: 'Súp hải sản',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Goulash',
    slug: MakeSlugger('Goulash'),
    description: 'Món hầm nổi tiếng của Hungary',
    short_description: 'Món hầm ngon',
    price: 75000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Biryani',
    slug: MakeSlugger('Biryani'),
    description: 'Cơm gà Ấn Độ đặc sắc',
    short_description: 'Cơm gà đặc sắc',
    price: 85000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Kimchi',
    slug: MakeSlugger('Kimchi'),
    description: 'Món ăn lên men Hàn Quốc',
    short_description: 'Món lên men',
    price: 20000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Dim Sum',
    slug: MakeSlugger('Dim Sum'),
    description: 'Món ăn nhẹ của Trung Quốc',
    short_description: 'Món ăn nhẹ',
    price: 70000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bouillabaisse',
    slug: MakeSlugger('Bouillabaisse'),
    description: 'Súp cá Pháp',
    short_description: 'Súp cá',
    price: 95000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Poutine',
    slug: MakeSlugger('Poutine'),
    description: 'Món khoai tây chiên của Canada',
    short_description: 'Khoai tây chiên',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Sauerbraten',
    slug: MakeSlugger('Sauerbraten'),
    description: 'Món thịt hầm Đức',
    short_description: 'Món thịt hầm',
    price: 80000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Gnocchi',
    slug: MakeSlugger('Gnocchi'),
    description: 'Món ăn Ý làm từ khoai tây',
    short_description: 'Khoai tây Ý',
    price: 65000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Tiramisu',
    slug: MakeSlugger('Tiramisu'),
    description: 'Món tráng miệng Ý',
    short_description: 'Tráng miệng Ý',
    price: 70000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Baklava',
    slug: MakeSlugger('Baklava'),
    description: 'Món tráng miệng của Thổ Nhĩ Kỳ',
    short_description: 'Món ngọt Thổ Nhĩ Kỳ',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Ceviche',
    slug: MakeSlugger('Ceviche'),
    description: 'Món hải sản sống của Peru',
    short_description: 'Hải sản sống',
    price: 70000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Pho',
    slug: MakeSlugger('Pho'),
    description: 'Món ăn truyền thống của Việt Nam',
    short_description: 'Món ăn truyền thống',
    price: 50000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Lasagna',
    slug: MakeSlugger('Lasagna'),
    description: 'Món ăn Ý nhiều lớp',
    short_description: 'Món ăn nhiều lớp',
    price: 75000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Ramen',
    slug: MakeSlugger('Ramen'),
    description: 'Món mì Nhật Bản',
    short_description: 'Món mì Nhật Bản',
    price: 70000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Pavlova',
    slug: MakeSlugger('Pavlova'),
    description: 'Món bánh tráng miệng của Úc',
    short_description: 'Bánh tráng miệng',
    price: 35000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Reuben Sandwich',
    slug: MakeSlugger('Reuben Sandwich'),
    description: 'Bánh sandwich của Mỹ',
    short_description: 'Bánh sandwich',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Chicken Adobo',
    slug: MakeSlugger('Chicken Adobo'),
    description: 'Món ăn truyền thống của Philippines',
    short_description: 'Món ăn Philippines',
    price: 65000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Empanada',
    slug: MakeSlugger('Empanada'),
    description: 'Bánh nhân của Argentina',
    short_description: 'Bánh nhân',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Spanakopita',
    slug: MakeSlugger('Spanakopita'),
    description: 'Bánh rau bina của Hy Lạp',
    short_description: 'Bánh Hy Lạp',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Pesto',
    slug: MakeSlugger('Pesto'),
    description: 'Nước sốt Ý làm từ basil',
    short_description: 'Nước sốt Ý',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bratwurst',
    slug: MakeSlugger('Bratwurst'),
    description: 'Giò heo Đức',
    short_description: 'Giò heo ngon',
    price: 70000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Turkish Delight',
    slug: MakeSlugger('Turkish Delight'),
    description: 'Món ngọt của Thổ Nhĩ Kỳ',
    short_description: 'Món ăn ngọt',
    price: 25000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Borscht',
    slug: MakeSlugger('Borscht'),
    description: 'Súp củ cải đỏ của Ukraine',
    short_description: 'Súp củ cải đỏ',
    price: 45000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Moussaka',
    slug: MakeSlugger('Moussaka'),
    description: 'Bánh lasagna của Hy Lạp',
    short_description: 'Món lasagna Hy Lạp',
    price: 75000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Risotto',
    slug: MakeSlugger('Risotto'),
    description: 'Cơm nấu theo kiểu Ý',
    short_description: 'Cơm Ý đặc trưng',
    price: 70000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Strudel',
    slug: MakeSlugger('Strudel'),
    description: 'Bánh ngọt từ Áo',
    short_description: 'Bánh thơm ngon',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Schnitzel',
    slug: MakeSlugger('Schnitzel'),
    description: 'Thịt chiên giòn của Áo',
    short_description: 'Thịt chiên giòn',
    price: 90000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Cevapi',
    slug: MakeSlugger('Cevapi'),
    description: 'Xúc xích nướng của Balkan',
    short_description: 'Xúc xích nướng',
    price: 50000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Frittata',
    slug: MakeSlugger('Frittata'),
    description: 'Trứng chiên kiểu Ý',
    short_description: 'Trứng chiên kiểu Ý',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Köttbullar',
    slug: MakeSlugger('Köttbullar'),
    description: 'Món thịt viên của Thụy Điển',
    short_description: 'Thịt viên Thụy Điển',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Rösti',
    slug: MakeSlugger('Rösti'),
    description: 'Món khoai tây chiên giòn của Thụy Sĩ',
    short_description: 'Khoai tây chiên giòn',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },

  {
    name: 'Fish and Chips',
    slug: MakeSlugger('Fish and Chips'),
    description: 'Món cá chiên của Anh',
    short_description: 'Cá và khoai tây chiên',
    price: 70000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bangers and Mash',
    slug: MakeSlugger('Bangers and Mash'),
    description: 'Xúc xích và khoai tây nghiền của Anh',
    short_description: 'Món ngon cổ điển',
    price: 65000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Panna Cotta',
    slug: MakeSlugger('Panna Cotta'),
    description: 'Món tráng miệng Ý kem',
    short_description: 'Món tráng miệng mềm',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Fasolada',
    slug: MakeSlugger('Fasolada'),
    description: 'Món súp đậu quốc dân của Hy Lạp',
    short_description: 'Súp đậu truyền thống',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bánh mì baguette',
    slug: MakeSlugger('Bánh mì baguette'),
    description: 'Bánh mì dài và giòn của Pháp',
    short_description: 'Bánh mì Pháp',
    price: 25000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Cabbage Roll',
    slug: MakeSlugger('Cabbage Roll'),
    description: 'Món cuốn bắp cải từ các nước Đông Âu',
    short_description: 'Cuốn bắp cải',
    price: 55000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Piperade',
    slug: MakeSlugger('Piperade'),
    description: 'Món rau xào kiểu Basque của Pháp',
    short_description: 'Rau xào Basque',
    price: 50000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Jollof Rice',
    slug: MakeSlugger('Jollof Rice'),
    description: 'Cơm nước sốt cà chua đặc trưng của Tây Phi',
    short_description: 'Cơm Tây Phi',
    price: 50000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Tagine',
    slug: MakeSlugger('Tagine'),
    description: 'Món hầm mix kiểu Maroc',
    short_description: 'Món hầm Maroc',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Bunny Chow',
    slug: MakeSlugger('Bunny Chow'),
    description: 'Món bánh mì nhồi từ Nam Phi',
    short_description: 'Bánh mì nhồi',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Injera',
    slug: MakeSlugger('Injera'),
    description: 'Bánh mỳ chua của Ethiopia',
    short_description: 'Bánh mì Ethiopia',
    price: 35000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Biltong',
    slug: MakeSlugger('Biltong'),
    description: 'Thịt khô Nam Phi',
    short_description: 'Thịt khô',
    price: 50000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Fufu',
    slug: MakeSlugger('Fufu'),
    description: 'Món ăn từ củ sắn ở Tây Phi',
    short_description: 'Món củ nổi bật',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Braai',
    slug: MakeSlugger('Braai'),
    description: 'Món nướng BBQ của Nam Phi',
    short_description: 'BBQ Nam Phi',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Piri Piri Chicken',
    slug: MakeSlugger('Piri Piri Chicken'),
    description: 'Gà nướng với nước sốt Piri Piri',
    short_description: 'Gà sốt cay',
    price: 75000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Mopane Worms',
    slug: MakeSlugger('Mopane Worms'),
    description: 'Worms chiên từ Namibia',
    short_description: 'Worms chiên',
    price: 20000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Doro Wat',
    slug: MakeSlugger('Doro Wat'),
    description: 'Món cà ri gà của Ethiopia',
    short_description: 'Cà ri gà',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Ugali',
    slug: MakeSlugger('Ugali'),
    description: 'Món bánh ngô từ Đông Phi',
    short_description: 'Bánh ngô',
    price: 25000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Samosa',
    slug: MakeSlugger('Samosa'),
    description: 'Bánh nhân từ Ấn Độ, phổ biến ở châu Phi',
    short_description: 'Bánh nhân',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Nsima',
    slug: MakeSlugger('Nsima'),
    description: 'Món bánh ngô đặc trưng của Malawi',
    short_description: 'Bánh ngô Malawi',
    price: 25000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Koshari',
    slug: MakeSlugger('Koshari'),
    description: 'Món ăn truyền thống của Ai Cập',
    short_description: 'Món ăn Ai Cập',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },

  {
    name: 'Chakalaka',
    slug: MakeSlugger('Chakalaka'),
    description: 'Món rau trộn cay của Nam Phi',
    short_description: 'Rau trộn cay',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Mealie Bread',
    slug: MakeSlugger('Mealie Bread'),
    description: 'Bánh ngô truyền thống',
    short_description: 'Bánh ngô',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Mogodu',
    slug: MakeSlugger('Mogodu'),
    description: 'Món lòng bò của Nam Phi',
    short_description: 'Lòng bò',
    price: 60000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Shakshuka',
    slug: MakeSlugger('Shakshuka'),
    description: 'Món trứng nấu với sốt cà chua và gia vị',
    short_description: 'Trứng sốt cà chua',
    price: 40000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Tajine',
    slug: MakeSlugger('Tajine'),
    description: 'Món hầm dùng nồi gốm đặc trưng của Bắc Phi',
    short_description: 'Món hầm Bắc Phi',
    price: 55000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Sukuma Wiki',
    slug: MakeSlugger('Sukuma Wiki'),
    description: 'Món rau cải châu Phi',
    short_description: 'Rau cải đặc trưng',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
  {
    name: 'Fried Plantains',
    slug: MakeSlugger('Fried Plantains'),
    description: 'Chuối chín chiên giòn, phổ biến ở nhiều quốc gia châu Phi',
    short_description: 'Chuối chiên',
    price: 30000,
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
  },
 
];

export const productSeed = async () => {
  const categoriesIDs = [];
  const categories = await prisma.categories.findMany();
  for (const category of categories) {
    categoriesIDs.push(category.id);
  }
  for (const product of products) {
    await prisma.products.create({
      data: {
        name: product.name,
        slug: product.slug,
        category_id:
          categoriesIDs[Math.floor(Math.random() * categoriesIDs.length)],
        description: product.description,
        short_description: product.short_description,
        price: product.price,
        images: product.images,
      },
    });
  }
};
