import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  await prisma.user.create({
    data: {
      username: 'ultron',
      email: 'ultron@system.local',
      passwordHash: await bcrypt.hash('admin@123', 12),
      fullName: 'Ultron',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  await prisma.user.create({
    data: {
      username: 'daneris',
      email: 'daneris.targaryen@example.com',
      passwordHash: await bcrypt.hash('customer@123', 12),
      fullName:
        'Daenerys Targaryen — Queen of the Andals, the Rhoynar and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, Mother of Dragons',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
