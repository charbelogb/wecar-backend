import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { BookingsService } from '../bookings/bookings.service';
import { CarsService } from '../cars/cars.service';
import { CreateCarDto } from '../cars/dto/create-car.dto';
import { UpdateCarDto } from '../cars/dto/update-car.dto';
import { UsersService } from '../users/users.service';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly carsService: CarsService,
    private readonly bookingsService: BookingsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('cars')
  listCars() {
    return this.carsService.listAllAdmin();
  }

  @Post('cars')
  createCar(@Body() dto: CreateCarDto) {
    return this.carsService.create(dto);
  }

  @Get('cars/:id')
  carDetail(@Param('id') id: string) {
    return this.carsService.getById(id);
  }

  @Patch('cars/:id')
  updateCar(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.carsService.update(id, dto);
  }

  @Delete('cars/:id')
  deleteCar(@Param('id') id: string) {
    return this.carsService.remove(id);
  }

  @Get('bookings')
  listBookings() {
    return this.bookingsService.getAllAdmin();
  }

  @Get('bookings/:id')
  bookingDetail(@Param('id') id: string) {
    return this.bookingsService.getOneAdmin(id);
  }

  @Patch('bookings/:id/status')
  updateBookingStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateBookingStatus(id, dto.bookingStatus);
  }

  @Get('customers')
  listCustomers() {
    return this.usersService.listCustomers();
  }
}
