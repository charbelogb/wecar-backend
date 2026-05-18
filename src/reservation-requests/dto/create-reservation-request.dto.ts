import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateReservationRequestDto {
  @IsString()
  carId: string;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @IsOptional()
  @IsBoolean()
  chauffeurRequired?: boolean;

  @IsOptional()
  @IsString()
  message?: string;
}
