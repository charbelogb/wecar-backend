export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export enum CarStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  UNAVAILABLE = 'UNAVAILABLE',
  ARCHIVED = 'ARCHIVED',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentProvider {
  MOCK = 'MOCK',
}
