import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Public()
  @Get()
  list(@Query('city') city?: string, @Query('category') category?: string) {
    return this.carsService.listPublic(city, category);
  }

  @Public()
  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.carsService.getPublicBySlug(slug);
  }
}
