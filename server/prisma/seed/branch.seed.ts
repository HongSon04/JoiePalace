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

const branches = [
  {
    name: 'Hà Nội',
    address: 'Đường 1, Quận 1, Hà Nội',
    slug: MakeSlugger('Hà Nội'),
    phone: '111111111',
    email: 'chinhanh1@joieplace.com',
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/xhnquxrdecjxbbialilg.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/pakoi5ihxkxbnqlnjgl1.jpg',
    ],
  },
  {
    name: 'Hồ Chí Minh',
    address: 'Đường 2, Quận 2, Hồ Chí Minh',
    slug: MakeSlugger('Hồ Chí Minh'),
    phone: '222222222',
    email: 'chinhanh2@joieplace.com',
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/xhnquxrdecjxbbialilg.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/pakoi5ihxkxbnqlnjgl1.jpg',
    ],
  },
  {
    name: 'Đà Nẵng',
    address: 'Đường 3, Quận 3, Đà Nẵng',
    slug: MakeSlugger('Đà Nẵng'),
    phone: '333333333',
    email: 'chinhanh3@joieplace.com',
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/xhnquxrdecjxbbialilg.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/pakoi5ihxkxbnqlnjgl1.jpg',
    ],
  },
  {
    name: 'Hải Phòng',
    address: 'Đường 4, Quận 4, Hải Phòng',
    slug: MakeSlugger('Hải Phòng'),
    phone: '444444444',
    email: 'chinhanh4@joieplace.com',
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/xhnquxrdecjxbbialilg.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/pakoi5ihxkxbnqlnjgl1.jpg',
    ],
  },
  {
    name: 'Cần Thơ',
    address: 'Đường 5, Quận 5, Cần Thơ',
    slug: MakeSlugger('Cần Thơ'),
    phone: '555555555',
    email: 'chinhanh5@joieplace.com',
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/xhnquxrdecjxbbialilg.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/pakoi5ihxkxbnqlnjgl1.jpg',
    ],
  },
  {
    name: 'Hà Tĩnh',
    address: 'Đường 6, Quận 6, Hà Tĩnh',
    slug: MakeSlugger('Hà Tĩnh'),
    phone: '666666666',
    email: 'chinhanh6@joieplace.com',
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/xhnquxrdecjxbbialilg.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/pakoi5ihxkxbnqlnjgl1.jpg',
    ],
  },
  {
    name: 'Hà Nam',
    address: 'Đường 7, Quận 7, Hà Nam',
    slug: MakeSlugger('Hà Nam'),
    phone: '777777777',
    email: 'chinhanh6@joieplace.com',
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/xhnquxrdecjxbbialilg.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/pakoi5ihxkxbnqlnjgl1.jpg',
    ],
  },
  {
    name: 'Hà Đông',
    address: 'Đường 8, Quận 8, Hà Đông',
    slug: MakeSlugger('Hà Đông'),
    phone: '888888888',
    email: 'chinhanh8@joieplace.com',
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/xhnquxrdecjxbbialilg.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/pakoi5ihxkxbnqlnjgl1.jpg',
    ],
  },
  {
    name: 'Hà Tây',
    address: 'Đường 9, Quận 9, Hà Tây',
    slug: MakeSlugger('Hà Tây'),
    phone: '09',
    email: 'chinhanh9@joieplace.com',
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/xhnquxrdecjxbbialilg.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/pakoi5ihxkxbnqlnjgl1.jpg',
    ],
  },
  {
    name: 'Cao Bằng',
    address: 'Đường 10, Quận 10, Cao Bằng',
    slug: MakeSlugger('Cao Bằng'),
    phone: '1010101010',
    email: 'chinhanh10@joieplace.com',
    images: [
      'https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/xhnquxrdecjxbbialilg.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/pakoi5ihxkxbnqlnjgl1.jpg',
    ],
  },
];
let branchIDS: number[] = [];
export const branchSeed = async () => {
  for (const branch of branches) {
    console.log('Creating branch:', branch.name);
    const branches = await prisma.branches.create({
      data: {
        name: branch.name,
        address: branch.address,
        slug: branch.slug,
        phone: branch.phone,
        email: branch.email,
        images: branch.images,
        slogan: 'Slogan',
        slogan_description: 'Slogan description',
        slogan_images: [
          'https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/xhnquxrdecjxbbialilg.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/pakoi5ihxkxbnqlnjgl1.jpg',
        ],
        diagram_description: 'Diagram description',
        equipment_description: 'Equipment description',
        diagram_images: [
          'https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/xhnquxrdecjxbbialilg.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/pakoi5ihxkxbnqlnjgl1.jpg',
        ],
        equipment_images: [
          'https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/xhnquxrdecjxbbialilg.jpg,https://res.cloudinary.com/dlpvcsewd/image/upload/v1726673256/joieplace/branch/pakoi5ihxkxbnqlnjgl1.jpg',
        ],
      },
    });
    branchIDS.push(branches.id);
  }
};
