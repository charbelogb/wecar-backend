import { createHmac } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PaymentInitiationPayload,
  PaymentInitiationResult,
  PaymentProviderService,
  PaymentVerificationResult,
} from './payment-provider.interface';

@Injectable()
export class MockPaymentProvider implements PaymentProviderService {
  constructor(private readonly configService: ConfigService) {}

  createTransaction(
    payload: PaymentInitiationPayload,
  ): Promise<PaymentInitiationResult> {
    const reference = `MOCK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    return Promise.resolve({
      reference,
      checkoutUrl: `${this.configService.get<string>('FRONTEND_BASE_URL', 'http://localhost:3000')}/checkout/mock/${reference}`,
      rawPayload: {
        reference,
        amount: payload.amount,
        currency: payload.currency,
        bookingId: payload.bookingId,
      },
    });
  }

  verifyTransaction(reference: string): Promise<PaymentVerificationResult> {
    return Promise.resolve({
      reference,
      status: 'successful',
      rawPayload: {
        reference,
        simulated: true,
      },
    });
  }

  validateWebhookSignature(
    payload: Record<string, unknown>,
    signature?: string,
  ): boolean {
    const secret = this.configService.get<string>(
      'PAYMENT_WEBHOOK_SECRET',
      'dev-secret',
    );
    const reference =
      typeof payload.reference === 'string' ? payload.reference : '';
    const status = typeof payload.status === 'string' ? payload.status : '';
    const expected = createHmac('sha256', secret)
      .update(`${reference}:${status}`)
      .digest('hex');

    return signature === expected;
  }
}
