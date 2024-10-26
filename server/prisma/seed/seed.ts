import { PrismaClient } from '@prisma/client';
import { userSeed } from './user.seed';
import { branchSeed } from './branch.seed';
import { categoriesSeed } from './categories.seed';
import { productSeed } from './product.seed';
import { menuSeed } from './menu.seed';
import { bookingSeed } from './booking.seed';
import { partyTypesSeed } from './party_types';
import { stageSeed } from './stage.seed';
import { feedbackSeed } from './feedback.seed';
import { decorSeed } from './decor.seed';

const prisma = new PrismaClient();

const seedMap: { [key: string]: (number: number) => Promise<void> } = {
  user: userSeed,
  branch: branchSeed,
  category: categoriesSeed,
  product: productSeed,
  menu: menuSeed,
  booking: bookingSeed,
  party: partyTypesSeed,
  stage: stageSeed,
  feedback: feedbackSeed,
  decor: decorSeed,
  all: async (number: number) => {
    await userSeed(number);
    await branchSeed();
    await categoriesSeed();
    await productSeed();
    await stageSeed();
    await decorSeed();
    await menuSeed();
    await partyTypesSeed();
    await bookingSeed();
    await feedbackSeed();
  },
};

const runSeed = async () => {
  // Get command line arguments directly
  const nameArg = process.argv[2]; // This should now be 'name=user'
  const numberArg = process.argv[3]; // This will be the number of records

  // Check for name argument
  if (!nameArg || !nameArg.startsWith('name=')) {
    console.error('Please provide a seed name using name=<value>');
    process.exit(1);
  }

  const name = nameArg.split('=')[1]; // Get the value after name=

  // Validate the number argument
  const number = parseInt(numberArg, 10) || 10;
  if (isNaN(number) || number <= 0) {
    console.error('Please provide a valid number of records to create.');
    process.exit(1);
  }

  // Check for the specified seeder in the seedMap
  if (!seedMap[name]) {
    console.error(`No seeder found for name: ${name}`);
    process.exit(1);
  }

  // Call the correct seeder with the number of records
  await seedMap[name](number);
  console.log(`Seeding ${name} finished.`);
  await prisma.$disconnect();
};

runSeed().catch((e) => {
  console.error(e);
  process.exit(1);
});
