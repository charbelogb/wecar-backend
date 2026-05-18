import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  carId: string;

  @IsDateString()
  @Type(() => Date)
  startDate: string;

  @IsDateString()
  @Type(() => Date)
  endDate: string;

  @IsString()
  pickupLocation: string;

  @IsBoolean()
  chauffeurSelected: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
