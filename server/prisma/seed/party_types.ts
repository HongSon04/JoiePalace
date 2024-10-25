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

export const partyTypesSeed = async () => {
  for (let i = 0; i < 10; i++) {
    const party = await prisma.party_types.create({
      data: {
        name: `Party Type ${i}`,
        price: 100000,
        description: `Description for Party Type ${i}`,
        images: [
          'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
        ],
        products: {
          connect: [
            {
              id: 1,
            },
            {
              id: 2,
            },
          ],
        },
      },
    });
    console.log(`Created party type : ${party.name}`);
  }
};
