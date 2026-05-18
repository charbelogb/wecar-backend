import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentStatus, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { BookingsService } from '../bookings/bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { MockPaymentProvider } from './providers/mock-payment.provider';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookingsService: BookingsService,
    private readonly configService: ConfigService,
    private readonly mockProvider: MockPaymentProvider,
  ) {}

  private getProvider() {
    const provider = this.configService
      .get<string>('PAYMENT_PROVIDER', 'MOCK')
      .toUpperCase();

    if (provider !== 'MOCK') {
      throw new BadRequestException(
        `Provider ${provider} is not configured. Use MOCK or implement a real provider adapter.`,
      );
    }

    return this.mockProvider;
  }

  async initiate(userId: string, bookingId: string) {
    const booking = await this.bookingsService.getOneForUser(userId, bookingId);

    const pendingPayment = booking.payments.find(
      (payment) => payment.status === PaymentStatus.PENDING,
    );

    if (!pendingPayment) {
      throw new BadRequestException(
        'No pending payment found for this booking',
      );
    }

    const provider = this.getProvider();
    const customerEmail =
      booking.user && typeof booking.user.email === 'string'
        ? booking.user.email
        : '';
    const initiation = await provider.createTransaction({
      bookingId,
      amount: Number(booking.upfrontAmount),
      currency: 'XOF',
      customerEmail,
    });

    await this.prisma.payment.update({
      where: { id: pendingPayment.id },
      data: {
        providerReference: initiation.reference,
        rawPayload: initiation.rawPayload as Prisma.InputJsonValue,
      },
    });

    return {
      bookingId,
      paymentId: pendingPayment.id,
      provider: this.configService.get<string>('PAYMENT_PROVIDER', 'MOCK'),
      reference: initiation.reference,
      checkoutUrl: initiation.checkoutUrl,
    };
  }

  async verify(userId: string, bookingId: string, reference: string) {
    await this.bookingsService.getOneForUser(userId, bookingId);

    const provider = this.getProvider();
    const verification = await provider.verifyTransaction(reference);

    if (verification.status === 'successful') {
      await this.bookingsService.markPaymentSuccessful(
        bookingId,
        reference,
        verification.rawPayload,
      );
    }

    return verification;
  }

  async handleWebhook(
    providerName: string,
    payload: Record<string, unknown>,
    signature?: string,
  ) {
    const provider = this.getProvider();

    if (providerName.toUpperCase() !== 'MOCK') {
      throw new BadRequestException('Unsupported provider');
    }

    if (!provider.validateWebhookSignature(payload, signature)) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const referenceValue = payload.reference;
    const statusValue = payload.status;

    if (typeof referenceValue !== 'string' || referenceValue.length === 0) {
      throw new BadRequestException('Missing payment reference');
    }

    if (typeof statusValue !== 'string') {
      throw new BadRequestException('Missing payment status');
    }

    const reference = referenceValue;
    const status = statusValue.toLowerCase();

    const payment = await this.prisma.payment.findFirst({
      where: { providerReference: reference },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (status === 'successful') {
      await this.bookingsService.markPaymentSuccessful(
        payment.bookingId,
        reference,
        payload,
      );
    }

    return {
      acknowledged: true,
      reference,
      status,
    };
  }
}
