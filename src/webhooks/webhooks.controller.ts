import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { PaymentsService } from '../payments/payments.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Post('payments/:provider')
  paymentWebhook(
    @Param('provider') provider: string,
    @Body() payload: Record<string, unknown>,
    @Headers('x-wecar-signature') signature?: string,
  ) {
    return this.paymentsService.handleWebhook(provider, payload, signature);
  }
}
