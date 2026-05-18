import { Injectable, NotFoundException } from '@nestjs/common';
import { CarStatus } from '../common/enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  listPublic(city?: string, category?: string, chauffeurAvailable?: boolean) {
    return this.prisma.car.findMany({
      where: {
        status: CarStatus.ACTIVE,
        ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
        ...(category
          ? { category: { equals: category, mode: 'insensitive' } }
          : {}),
        ...(chauffeurAvailable !== undefined ? { chauffeurAvailable } : {}),
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPublicBySlug(slug: string) {
    const car = await this.prisma.car.findFirst({
      where: {
        slug,
        status: CarStatus.ACTIVE,
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async getSimilar(slug: string) {
    const car = await this.prisma.car.findFirst({
      where: { slug, status: CarStatus.ACTIVE },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return this.prisma.car.findMany({
      where: {
        status: CarStatus.ACTIVE,
        id: { not: car.id },
        OR: [{ category: car.category }, { city: car.city }],
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    });
  }
}
