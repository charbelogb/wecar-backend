import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';
import { ReservationRequestsService } from './reservation-requests.service';

@Controller('reservation-requests')
export class ReservationRequestsController {
  constructor(
    private readonly reservationRequestsService: ReservationRequestsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateReservationRequestDto) {
    return this.reservationRequestsService.create(dto);
  }
}
