import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AvailabilitySource,
  BookingStatus,
  CarStatus,
  PaymentProvider,
  PaymentStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { CreateBookingDto } from './dto/create-booking.dto';

const UPFRONT_PERCENTAGE = 0.3;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  async create(userId: string, dto: CreateBookingDto) {
    const car = await this.prisma.car.findUnique({ where: { id: dto.carId } });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (car.status !== CarStatus.ACTIVE) {
      throw new ConflictException('Car is not available for booking');
    }

    const { startDate, endDate, daysCount } = this.validateBookingDates(
      dto.startDate,
      dto.endDate,
    );

    const hasConflict = await this.availabilityService.hasConflict(
      car.id,
      startDate,
      endDate,
    );

    if (hasConflict) {
      throw new ConflictException('Selected dates are unavailable');
    }

    const pricing = this.calculatePricing({
      daysCount,
      pricePerDay: Number(car.pricePerDay),
      chauffeurSelected: dto.chauffeurSelected,
      chauffeurPricePerDay: Number(car.chauffeurPricePerDay ?? 0),
    });

    return this.prisma.booking.create({
      data: {
        userId,
        carId: car.id,
        startDate,
        endDate,
        daysCount,
        pickupLocation: dto.pickupLocation,
        chauffeurSelected: dto.chauffeurSelected,
        subtotalAmount: pricing.subtotal,
        chauffeurAmount: pricing.chauffeurAmount,
        totalAmount: pricing.total,
        upfrontAmount: pricing.upfront,
        remainingAmount: pricing.remaining,
        paymentStatus: PaymentStatus.PENDING,
        bookingStatus: BookingStatus.PENDING,
        notes: dto.notes,
        payments: {
          create: {
            provider: PaymentProvider.MOCK,
            amount: pricing.upfront,
            currency: 'XOF',
            status: PaymentStatus.PENDING,
          },
        },
      },
      include: {
        car: true,
        payments: true,
      },
    });
  }

  async getMine(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        car: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOneForUser(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        car: true,
        payments: true,
        user: {
          select: { id: true, email: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('You cannot access this booking');
    }

    return booking;
  }

  getAllAdmin() {
    return this.prisma.booking.findMany({
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        car: {
          select: { id: true, title: true, slug: true, city: true },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOneAdmin(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        car: true,
        payments: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateBookingStatus(bookingId: string, bookingStatus: BookingStatus) {
    await this.getOneAdmin(bookingId);

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { bookingStatus },
    });
  }

  async markPaymentSuccessful(
    bookingId: string,
    providerReference: string,
    payload: unknown,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const pendingPayment = booking.payments.find(
      (payment) => payment.status === PaymentStatus.PENDING,
    );

    if (!pendingPayment) {
      return booking;
    }

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: pendingPayment.id },
        data: {
          status: PaymentStatus.SUCCESSFUL,
          providerReference,
          paidAt: new Date(),
          rawPayload: payload as Prisma.InputJsonValue,
        },
      }),
      this.prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: PaymentStatus.SUCCESSFUL,
          bookingStatus: BookingStatus.PAID,
          availabilityBlock: {
            upsert: {
              create: {
                carId: booking.carId,
                startDate: booking.startDate,
                endDate: booking.endDate,
                source: AvailabilitySource.BOOKING,
                note: 'Automatically blocked after payment',
              },
              update: {
                startDate: booking.startDate,
                endDate: booking.endDate,
              },
            },
          },
        },
      }),
    ]);

    return this.getOneAdmin(booking.id);
  }

  validateBookingDates(start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid booking dates');
    }

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const daysCount = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / DAY_IN_MS,
    );

    if (daysCount <= 0) {
      throw new BadRequestException('Booking must be at least 1 day');
    }

    return { startDate, endDate, daysCount };
  }

  calculatePricing(params: {
    daysCount: number;
    pricePerDay: number;
    chauffeurSelected: boolean;
    chauffeurPricePerDay: number;
  }) {
    const subtotal = params.daysCount * params.pricePerDay;
    const chauffeurAmount =
      params.chauffeurSelected && params.chauffeurPricePerDay > 0
        ? params.daysCount * params.chauffeurPricePerDay
        : 0;
    const total = subtotal + chauffeurAmount;
    const upfront = Number((total * UPFRONT_PERCENTAGE).toFixed(2));
    const remaining = Number((total - upfront).toFixed(2));

    return {
      subtotal,
      chauffeurAmount,
      total,
      upfront,
      remaining,
    };
  }
}
