import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
const prisma = new PrismaClient();

const MakeSlugger = (str: string): string => {
  return slugify(str, {
    replacement: '',
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
    name: 'Món chính',
    slug: MakeSlugger('Món chính'),
    description: 'Món chính',
    short_description: 'Món chính',
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
];

export const categoriesSeed = async () => {
  for (const category of categories) {
    await prisma.categories.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        short_description: category.short_description,
      },
    });
  }
};
