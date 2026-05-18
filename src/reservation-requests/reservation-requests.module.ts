import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { ReservationRequestsController } from './reservation-requests.controller';
import { ReservationRequestsService } from './reservation-requests.service';

@Module({
  imports: [NotificationsModule],
  controllers: [ReservationRequestsController],
  providers: [ReservationRequestsService],
})
export class ReservationRequestsModule {}
