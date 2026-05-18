import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';

@Injectable()
export class ReservationRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(dto: CreateReservationRequestDto) {
    const car = await this.prisma.car.findUnique({
      where: { id: dto.carId },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (end <= start) {
      throw new BadRequestException('End date must be after start date');
    }

    const request = await this.prisma.reservationRequest.create({
      data: {
        carId: dto.carId,
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        startDate: start,
        endDate: end,
        pickupLocation: dto.pickupLocation,
        chauffeurRequired: dto.chauffeurRequired ?? false,
        message: dto.message,
      },
      include: { car: { select: { title: true, slug: true } } },
    });

    this.notifications.onReservationRequestCreated(request);

    return request;
  }
}
