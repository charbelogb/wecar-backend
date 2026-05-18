import { Body, Controller, Post } from '@nestjs/common';
import { IsString } from 'class-validator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { PaymentsService } from './payments.service';

class InitiatePaymentDto {
  @IsString()
  bookingId: string;
}

class VerifyPaymentDto {
  @IsString()
  bookingId: string;

  @IsString()
  reference: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  initiate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiate(user.id, dto.bookingId);
  }

  @Post('verify')
  verify(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.paymentsService.verify(user.id, dto.bookingId, dto.reference);
  }
}
