import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly internalEmail: string;

  constructor(private readonly config: ConfigService) {
    this.internalEmail = this.config.get<string>(
      'NOTIFICATION_EMAIL',
      'team@wecar.local',
    );
  }

  onReservationRequestCreated(request: {
    id: string;
    fullName: string;
    phone: string;
    email?: string | null;
    car: { title: string; slug: string };
  }) {
    this.logger.log(
      `[RESERVATION REQUEST] id=${request.id} car="${request.car.title}" ` +
        `customer="${request.fullName}" phone=${request.phone}`,
    );

    // Internal notification stub
    this.logger.debug(
      `Would send internal notification to ${this.internalEmail}: ` +
        `New reservation request for ${request.car.title} from ${request.fullName}`,
    );

    // Customer confirmation stub
    if (request.email) {
      this.logger.debug(
        `Would send confirmation email to ${request.email}: ` +
          `Your request for ${request.car.title} has been received.`,
      );
    }
  }

  onCustomRequestCreated(request: {
    id: string;
    fullName: string;
    phone: string;
    email?: string | null;
    city?: string | null;
  }) {
    this.logger.log(
      `[CUSTOM REQUEST] id=${request.id} customer="${request.fullName}" ` +
        `phone=${request.phone} city=${request.city ?? 'N/A'}`,
    );

    // Internal notification stub
    this.logger.debug(
      `Would send internal notification to ${this.internalEmail}: ` +
        `New custom request from ${request.fullName}`,
    );

    // Customer confirmation stub
    if (request.email) {
      this.logger.debug(
        `Would send confirmation email to ${request.email}: ` +
          `Your request has been received. We will contact you shortly.`,
      );
    }
  }
}
