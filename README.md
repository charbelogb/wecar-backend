# WeCar Backend — Ultra-Simple MVP

Lightweight NestJS + PostgreSQL + Prisma backend for the WeCar MVP.

WeCar is a **lead-generation and assisted booking** platform for vehicle rental. The backend behaves like a lightweight CRM/data API, not a full booking engine. Availability is confirmed manually via WhatsApp after a request is submitted.

## Tech stack

- **NestJS** (TypeScript)
- **Prisma ORM**
- **PostgreSQL**

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/settings` | Public config (WhatsApp number, currency) |
| `GET` | `/cars` | List active cars (supports `city`, `category`, `chauffeurAvailable` query params) |
| `GET` | `/cars/:slug` | Single car detail with images |
| `GET` | `/cars/:slug/similar` | Similar cars (same category or city) |
| `POST` | `/reservation-requests` | Submit a reservation request for a specific car |
| `POST` | `/custom-requests` | Submit a custom request (user describes their need) |

## Environment setup

1. Copy the env template:

```bash
cp .env.example .env
```

2. Set your `DATABASE_URL` in `.env`.

## Install and run

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Run API in watch mode |
| `npm run build` | Build for production |
| `npm run start:prod` | Run production build |
| `npm run test` | Run unit tests |
| `npm run lint` | Lint code |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Apply DB migrations |
| `npm run prisma:seed` | Seed sample car data |

## Data models

### Car
Fields: `id`, `slug`, `title`, `brand`, `model`, `year`, `city`, `category`, `pricePerDay`, `chauffeurAvailable`, `transmission`, `fuelType`, `seats`, `description`, `mainImageUrl`, `pickupZone`, `depositAmount`, `rentalPolicy`, `cancellationPolicy`, `whatsappPhone`, `status`, `createdAt`

### CarImage
Fields: `id`, `carId`, `imageUrl`, `sortOrder`

### ReservationRequest
Fields: `id`, `carId`, `fullName`, `phone`, `email`, `startDate`, `endDate`, `pickupLocation`, `chauffeurRequired`, `message`, `status`, `createdAt`

### CustomRequest
Fields: `id`, `fullName`, `phone`, `email`, `startDate`, `endDate`, `city`, `budgetEstimate`, `preferredVehicleType`, `chauffeurRequired`, `message`, `status`, `createdAt`

## Request status flow

All requests start with status `NEW`. Status is updated manually:
`NEW` → `CONTACTED` → `CONVERTED` / `CANCELLED`

## Notifications

A `NotificationsService` is included with a **logging adapter** (no-op by default). It logs to the console when a reservation or custom request is created. To add real email delivery, replace the log statements in `src/notifications/notifications.service.ts` with a provider like Nodemailer or Resend.

## What is intentionally NOT implemented

- Authentication / JWT
- Admin dashboard or CRUD endpoints
- Payment processing
- Live availability management
- Webhook flows
- Booking status engine

