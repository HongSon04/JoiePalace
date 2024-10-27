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

export const stageSeed = async () => {
  const branches = await prisma.branches.findMany();
  const branchIds = branches.map((branch) => branch.id);

  for (let i = 0; i < 10; i++) {
    const randomBranchId =
      branchIds[Math.floor(Math.random() * branchIds.length)];
    const stages = await prisma.stages.create({
      data: {
        name: `Stage ${i}`,
        description: `Description for stage ${i}`,
        capacity_min: 10,
        capacity_max: 20,
        branch_id: Number(randomBranchId),
        images: [
          'https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472645/joieplace/products/y0c7tfqz3sxjocxuxtee.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1725472646/joieplace/products/cbe7ecs5kzugthltxdb1.jpg',
        ],
      },
    });
    console.log(`Created stage: ${stages.name}`);
  }
};
