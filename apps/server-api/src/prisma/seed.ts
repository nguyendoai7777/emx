import { PrismaClient } from '../prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin';
  const passwordHash = await hash('qaz123QAZ!@#');
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: passwordHash,
      role: 'ADMIN',
      fullName: 'Super Admin',
    },
  });
  console.log(`@@ Prisma seeding`, user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
