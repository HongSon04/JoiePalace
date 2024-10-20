import { PrismaClient } from '@prisma/client';
import { name } from 'ejs';
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

const categories = [
  {
    name: 'Nước uống',
    slug: MakeSlugger('Nước uống'),
    description: 'Đồ uống giải khát',
    short_description: 'Đồ uống giải khát',
  },
  {
    name: 'Nước ép',
    category_id: 1,
    slug: MakeSlugger('Nước ép'),
    description: 'Nước ép hoa quả',
    short_description: 'Nước ép hoa quả',
  },
  {
    name: 'Nước ngọt',
    category_id: 1,
    slug: MakeSlugger('Nước ngọt'),
    description: 'Nước ngọt',
    short_description: 'Nước ngọt',
  },
  {
    name: 'Nước trái cây',
    category_id: 1,
    slug: MakeSlugger('Nước trái cây'),
    description: 'Nước trái cây',
    short_description: 'Nước trái cây',
  },
  {
    name: 'Thức Ăn',
    slug: MakeSlugger('Thức Ăn'),
    description: 'Thức Ăn',
    short_description: 'Thức Ăn',
  },
  {
    name: 'Món chính',
    category_id: 5,
    slug: MakeSlugger('Món chính'),
    description: 'Món chính',
    short_description: 'Món chính',
  },
  {
    name: 'Món ăn nhanh',
    slug: MakeSlugger('Món ăn nhanh'),
    description: 'Món ăn nhanh',
    short_description: 'Món ăn nhanh',
  },
  {
    name: 'Tráng miệng',
    slug: MakeSlugger('Tráng miệng'),
    description: 'Tráng miệng',
    short_description: 'Tráng miệng',
  },
  {
    name: 'Dịch vụ thêm',
    slug: MakeSlugger('Dịch vụ thêm'),
    description: 'Dịch vụ thêm',
    short_description: 'Dịch vụ thêm',
  },
  {
    name: 'Bài viết',
    slug: MakeSlugger('Bài viết'),
    description: 'Bài viết',
    short_description: 'Bài viết',
  },
  {
    name: 'Tin tức',
    category_id: 11,
    slug: MakeSlugger('Tin tức'),
    description: 'Tin tức',
    short_description: 'Tin tức',
  },
  {
    name: 'Sự kiện',
    category_id: 11,
    slug: MakeSlugger('Sự kiện'),
    description: 'Sự kiện',
    short_description: 'Sự kiện',
  },
];

export const categoriesSeed = async () => {
  for (const category of categories) {
    await prisma.categories.create({
      data: {
        name: category.name,
        slug: category.slug,
        category_id: category.category_id,
        description: category.description,
        short_description: category.short_description,
      },
    });
  }
};
