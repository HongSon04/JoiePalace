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

export const menuSeed = async () => {
  await prisma.menus.create({
    data: {
      name: `Menu 1`,
      slug: MakeSlugger(`Menu 1`),
      description: 'Mô tả menu',
      products: {
        connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
      },
      price: 200000,
    },
  });
};
