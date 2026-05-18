import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CarStatus } from '../../common/enums';

export class CreateCarDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsInt()
  year: number;

  @IsString()
  category: string;

  @IsString()
  city: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pricePerDay: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  depositAmount: number;

  @IsBoolean()
  chauffeurAvailable: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  chauffeurPricePerDay?: number;

  @IsString()
  transmission: string;

  @IsString()
  fuelType: string;

  @IsInt()
  @Min(1)
  seats: number;

  @IsString()
  description: string;

  @IsString()
  mainImageUrl: string;

  @IsOptional()
  @IsEnum(CarStatus)
  status?: CarStatus;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];
}
