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

const products = [
  {
    name: 'Bún riêu',
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
    slug: MakeSlugger('Bún mắm'),
    description: 'Món ăn ngon',
    short_description: 'Món ăn ngon',
    price: 60000,
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
        category_id: Number(
          categoriesIDs[Math.floor(Math.random() * categoriesIDs.length)],
        ),
        description: product.description,
        short_description: product.short_description,
        price: product.price,
        images: product.images,
      },
    });
  }
};
