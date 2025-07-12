import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  // Create an admin user if it doesn't exist
  await prisma.user.upsert({
    where: { email: 'admin@kanban.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@kanban.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Database has been seeded successfully!');
  console.log('Admin account created:');
  console.log('Admin Credentials: admin@kanban.com / admin123');
  console.log(
    'To create a user account, use the register page in the frontend.',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void (async () => {
      await prisma.$disconnect();
    })();
  });
