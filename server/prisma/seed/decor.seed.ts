import { PrismaClient } from '@prisma/client';
import { connect } from 'http2';
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

const decors = [
  {
    name: 'Cây cảnh',
    description: 'Cây cảnh',
    short_description: 'Cây cảnh',
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
    price: 100000,
    products: {
      connect: {
        id: 1,
      },
    },
  },
  {
    name: 'Trang trí',
    description: 'Trang trí',
    short_description: 'Trang trí',
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
    price: 100000,
    products: {
      connect: {
        id: 1,
      },
    },
  },
  {
    name: 'Đồ chơi',
    description: 'Đồ chơi',
    short_description: 'Đồ chơi',
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
    ],
    price: 100000,
    products: {
      connect: {
        id: 1,
      },
    },
  },
];

export const decorSeed = async () => {
  for (const decor of decors) {
    const dc = await prisma.decors.create({
      data: {
        ...decor,
      },
    });
    console.log('Decor seeded' + dc.name);
  }
};
