const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Admin
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      address: 'Admin HQ',
    },
  });
  console.log({ admin });

  // Create Store Owners
  const ownerPassword = await bcrypt.hash('Owner@123', 10);
  
  const owner1 = await prisma.user.upsert({
    where: { email: 'owner1@example.com' },
    update: {},
    create: {
      name: 'John StoreOwner',
      email: 'owner1@example.com',
      password: ownerPassword,
      role: 'STORE_OWNER',
      address: '123 Market St',
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'owner2@example.com' },
    update: {},
    create: {
      name: 'Jane StoreOwner',
      email: 'owner2@example.com',
      password: ownerPassword,
      role: 'STORE_OWNER',
      address: '456 Commerce Blvd',
    },
  });

  console.log({ owner1, owner2 });

  // Create Stores
  const store1 = await prisma.store.create({
    data: {
      name: "John's Electronics",
      email: 'contact@johnselectronics.com',
      address: '123 Market St, Tech City',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: "Jane's Fashion",
      email: 'contact@janesfashion.com',
      address: '456 Commerce Blvd, Style Town',
      ownerId: owner2.id,
    },
  });

  console.log({ store1, store2 });

  // Create Normal Users
  const userPassword = await bcrypt.hash('User@123', 10);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      name: 'Alice User',
      email: 'user1@example.com',
      password: userPassword,
      role: 'USER',
      address: '789 Residential Ln',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      name: 'Bob User',
      email: 'user2@example.com',
      password: userPassword,
      role: 'USER',
      address: '101 Apartment Ave',
    },
  });

  console.log({ user1, user2 });

  // Create Ratings
  await prisma.rating.create({
    data: {
      userId: user1.id,
      storeId: store1.id,
      rating: 5,
    },
  });

  await prisma.rating.create({
    data: {
      userId: user2.id,
      storeId: store1.id,
      rating: 4,
    },
  });

  await prisma.rating.create({
    data: {
      userId: user1.id,
      storeId: store2.id,
      rating: 3,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
