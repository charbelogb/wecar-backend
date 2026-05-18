import { CarStatus, PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const customerPasswordHash = await bcrypt.hash('Customer123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@wecar.local' },
    update: {},
    create: {
      fullName: 'WeCar Admin',
      email: 'admin@wecar.local',
      phone: '+22900000000',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@wecar.local' },
    update: {},
    create: {
      fullName: 'Demo Customer',
      email: 'customer@wecar.local',
      phone: '+22911111111',
      passwordHash: customerPasswordHash,
      role: UserRole.CUSTOMER,
    },
  });

  await prisma.car.upsert({
    where: { slug: 'toyota-corolla-2022' },
    update: {},
    create: {
      slug: 'toyota-corolla-2022',
      title: 'Toyota Corolla 2022',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2022,
      category: 'Sedan',
      city: 'Cotonou',
      pricePerDay: 45000,
      depositAmount: 100000,
      chauffeurAvailable: true,
      chauffeurPricePerDay: 10000,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      description: 'Comfortable city sedan for everyday travel.',
      mainImageUrl: 'https://images.unsplash.com/photo-1493238792000-8113da705763',
      status: CarStatus.ACTIVE,
      images: {
        create: [
          {
            imageUrl:
              'https://images.unsplash.com/photo-1493238792000-8113da705763',
            sortOrder: 0,
          },
          {
            imageUrl:
              'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
            sortOrder: 1,
          },
        ],
      },
    },
  });

  console.log({ admin: admin.email, customer: customer.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
