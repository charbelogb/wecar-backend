import { CarStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ---- Cars ----
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
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      description:
        'Confortable berline citadine idéale pour vos déplacements quotidiens à Cotonou. ' +
        'Climatisation, GPS et chauffeur disponibles sur demande.',
      mainImageUrl:
        'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800',
      pickupZone: 'Cotonou centre, Aéroport de Cotonou',
      rentalPolicy:
        'Location avec ou sans chauffeur. Carburant non inclus. Kilométrage illimité dans la ville.',
      cancellationPolicy:
        'Annulation gratuite jusqu\'à 24h avant le début de la location.',
      whatsappPhone: '+22900000000',
      status: CarStatus.ACTIVE,
      images: {
        create: [
          {
            imageUrl:
              'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800',
            sortOrder: 0,
          },
          {
            imageUrl:
              'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
            sortOrder: 1,
          },
        ],
      },
    },
  });

  await prisma.car.upsert({
    where: { slug: 'mercedes-classe-e-2021' },
    update: {},
    create: {
      slug: 'mercedes-classe-e-2021',
      title: 'Mercedes Classe E 2021',
      brand: 'Mercedes',
      model: 'Classe E',
      year: 2021,
      category: 'Berline Premium',
      city: 'Cotonou',
      pricePerDay: 85000,
      depositAmount: 200000,
      chauffeurAvailable: true,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      description:
        'Berline premium pour vos voyages d\'affaires ou événements spéciaux. ' +
        'Confort exceptionnel, système audio haut de gamme, chauffeur professionnel disponible.',
      mainImageUrl:
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      pickupZone: 'Cotonou, Calavi, Porto-Novo',
      rentalPolicy:
        'Location avec chauffeur recommandée. Carburant inclus avec chauffeur.',
      cancellationPolicy:
        'Annulation gratuite jusqu\'à 48h avant le début de la location.',
      whatsappPhone: '+22900000000',
      status: CarStatus.ACTIVE,
      images: {
        create: [
          {
            imageUrl:
              'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
            sortOrder: 0,
          },
          {
            imageUrl:
              'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
            sortOrder: 1,
          },
        ],
      },
    },
  });

  await prisma.car.upsert({
    where: { slug: 'toyota-land-cruiser-2020' },
    update: {},
    create: {
      slug: 'toyota-land-cruiser-2020',
      title: 'Toyota Land Cruiser 2020',
      brand: 'Toyota',
      model: 'Land Cruiser',
      year: 2020,
      category: 'SUV',
      city: 'Cotonou',
      pricePerDay: 120000,
      depositAmount: 300000,
      chauffeurAvailable: true,
      transmission: 'Automatic',
      fuelType: 'Diesel',
      seats: 7,
      description:
        'Le 4x4 par excellence pour vos déplacements en toute sécurité, même hors routes. ' +
        '7 places, idéal pour les familles ou les déplacements en groupe.',
      mainImageUrl:
        'https://images.unsplash.com/photo-1594686405249-8f6eff3d5cc8?w=800',
      pickupZone: 'Cotonou, Porto-Novo, Parakou',
      rentalPolicy:
        'Location longue durée disponible. Chauffeur expérimenté obligatoire hors Cotonou.',
      cancellationPolicy:
        'Annulation gratuite jusqu\'à 48h avant le début de la location.',
      whatsappPhone: '+22900000000',
      status: CarStatus.ACTIVE,
      images: {
        create: [
          {
            imageUrl:
              'https://images.unsplash.com/photo-1594686405249-8f6eff3d5cc8?w=800',
            sortOrder: 0,
          },
        ],
      },
    },
  });

  await prisma.car.upsert({
    where: { slug: 'honda-crv-2022' },
    update: {},
    create: {
      slug: 'honda-crv-2022',
      title: 'Honda CR-V 2022',
      brand: 'Honda',
      model: 'CR-V',
      year: 2022,
      category: 'SUV',
      city: 'Porto-Novo',
      pricePerDay: 55000,
      depositAmount: 150000,
      chauffeurAvailable: false,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      description:
        'SUV compact polyvalent, parfait pour la ville et les routes secondaires. ' +
        'Économique, confortable et spacieux.',
      mainImageUrl:
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      pickupZone: 'Porto-Novo centre',
      rentalPolicy:
        'Location sans chauffeur uniquement. Permis de conduire requis.',
      cancellationPolicy:
        'Annulation gratuite jusqu\'à 24h avant le début de la location.',
      whatsappPhone: '+22900000000',
      status: CarStatus.ACTIVE,
      images: {
        create: [
          {
            imageUrl:
              'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
            sortOrder: 0,
          },
        ],
      },
    },
  });

  await prisma.car.upsert({
    where: { slug: 'hyundai-tucson-2023' },
    update: {},
    create: {
      slug: 'hyundai-tucson-2023',
      title: 'Hyundai Tucson 2023',
      brand: 'Hyundai',
      model: 'Tucson',
      year: 2023,
      category: 'SUV',
      city: 'Cotonou',
      pricePerDay: 60000,
      depositAmount: 150000,
      chauffeurAvailable: true,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      description:
        'SUV moderne et élégant, idéal pour les déplacements professionnels. ' +
        'Design contemporain, technologie embarquée de dernière génération.',
      mainImageUrl:
        'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=800',
      pickupZone: 'Cotonou, Calavi',
      rentalPolicy:
        'Location avec ou sans chauffeur. Kilométrage limité à 200km/jour.',
      cancellationPolicy:
        'Annulation gratuite jusqu\'à 24h avant. 50% de frais si annulation dans les 24h.',
      whatsappPhone: '+22900000000',
      status: CarStatus.ACTIVE,
      images: {
        create: [
          {
            imageUrl:
              'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=800',
            sortOrder: 0,
          },
        ],
      },
    },
  });

  console.log('Seed completed: 5 cars created or already present.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

