export interface PaymentInitiationPayload {
  bookingId: string;
  amount: number;
  currency: string;
  customerEmail: string;
}

export interface PaymentInitiationResult {
  reference: string;
  checkoutUrl: string;
  rawPayload: Record<string, unknown>;
}

export interface PaymentVerificationResult {
  reference: string;
  status: 'successful' | 'failed' | 'pending';
  rawPayload: Record<string, unknown>;
}

export interface PaymentProviderService {
  createTransaction(
    payload: PaymentInitiationPayload,
  ): Promise<PaymentInitiationResult>;
  verifyTransaction(reference: string): Promise<PaymentVerificationResult>;
  validateWebhookSignature(
    payload: Record<string, unknown>,
    signature?: string,
  ): boolean;
}
