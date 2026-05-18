import { ConflictException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AvailabilityService } from '../availability/availability.service';

describe('BookingsService', () => {
  const prismaMock = {
    car: { findUnique: jest.fn() },
    booking: { create: jest.fn(), findUnique: jest.fn(), findMany: jest.fn() },
    payment: { update: jest.fn(), findFirst: jest.fn() },
    availabilityBlock: { count: jest.fn() },
    user: { findMany: jest.fn() },
    $transaction: jest.fn(),
  };

  const availabilityMock: jest.Mocked<AvailabilityService> = {
    hasConflict: jest.fn(),
  } as unknown as jest.Mocked<AvailabilityService>;

  const service = new BookingsService(prismaMock as never, availabilityMock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculates pricing with chauffeur surcharge and 30% upfront', () => {
    const pricing = service.calculatePricing({
      daysCount: 3,
      pricePerDay: 100,
      chauffeurSelected: true,
      chauffeurPricePerDay: 20,
    });

    expect(pricing).toEqual({
      subtotal: 300,
      chauffeurAmount: 60,
      total: 360,
      upfront: 108,
      remaining: 252,
    });
  });

  it('throws conflict when requested dates overlap existing blocks/bookings', async () => {
    prismaMock.car.findUnique.mockResolvedValue({
      id: 'car-1',
      status: 'ACTIVE',
      pricePerDay: 100,
      chauffeurPricePerDay: 10,
    });

    availabilityMock.hasConflict.mockResolvedValue(true);

    await expect(
      service.create('user-1', {
        carId: 'car-1',
        startDate: '2026-06-10',
        endDate: '2026-06-12',
        pickupLocation: 'Cotonou',
        chauffeurSelected: false,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
