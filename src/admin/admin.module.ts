import { Module } from '@nestjs/common';
import { BookingsModule } from '../bookings/bookings.module';
import { CarsModule } from '../cars/cars.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [CarsModule, BookingsModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}
