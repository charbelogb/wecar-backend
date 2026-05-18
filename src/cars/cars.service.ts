import { Injectable, NotFoundException } from '@nestjs/common';
import { CarStatus } from '../common/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  listPublic(city?: string, category?: string) {
    return this.prisma.car.findMany({
      where: {
        status: CarStatus.ACTIVE,
        ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
        ...(category
          ? { category: { equals: category, mode: 'insensitive' } }
          : {}),
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

  listAllAdmin() {
    return this.prisma.car.findMany({
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  create(dto: CreateCarDto) {
    const { imageUrls = [], ...data } = dto;

    return this.prisma.car.create({
      data: {
        ...data,
        status: dto.status ?? CarStatus.DRAFT,
        images: {
          create: imageUrls.map((imageUrl, index) => ({
            imageUrl,
            sortOrder: index,
          })),
        },
      },
      include: { images: true },
    });
  }

  async update(id: string, dto: UpdateCarDto) {
    await this.getById(id);

    const { imageUrls, ...data } = dto;

    return this.prisma.car.update({
      where: { id },
      data: {
        ...data,
        ...(imageUrls
          ? {
              images: {
                deleteMany: {},
                create: imageUrls.map((imageUrl, index) => ({
                  imageUrl,
                  sortOrder: index,
                })),
              },
            }
          : {}),
      },
      include: { images: true },
    });
  }

  async remove(id: string) {
    await this.getById(id);

    return this.prisma.car.delete({ where: { id } });
  }
}
