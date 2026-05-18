import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomRequestDto } from './dto/create-custom-request.dto';

@Injectable()
export class CustomRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(dto: CreateCustomRequestDto) {
    if (dto.startDate && dto.endDate) {
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);

      if (end <= start) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    const request = await this.prisma.customRequest.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        city: dto.city,
        budgetEstimate: dto.budgetEstimate,
        preferredVehicleType: dto.preferredVehicleType,
        chauffeurRequired: dto.chauffeurRequired ?? false,
        message: dto.message,
      },
    });

    this.notifications.onCustomRequestCreated(request);

    return request;
  }
}
