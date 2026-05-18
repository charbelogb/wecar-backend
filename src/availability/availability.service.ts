import { Injectable } from '@nestjs/common';
import { BookingStatus } from '../common/enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async hasConflict(
    carId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    const [bookingsCount, blockCount] = await Promise.all([
      this.prisma.booking.count({
        where: {
          carId,
          bookingStatus: { in: [BookingStatus.PAID, BookingStatus.CONFIRMED] },
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      }),
      this.prisma.availabilityBlock.count({
        where: {
          carId,
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      }),
    ]);

    return bookingsCount > 0 || blockCount > 0;
  }
}
