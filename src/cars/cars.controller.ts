import { Controller, Get, Param, Query } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  list(
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('chauffeurAvailable') chauffeurAvailable?: string,
  ) {
    let chauffeur: boolean | undefined;
    if (chauffeurAvailable === 'true') {
      chauffeur = true;
    } else if (chauffeurAvailable === 'false') {
      chauffeur = false;
    }
    return this.carsService.listPublic(city, category, chauffeur);
  }

  @Get(':slug/similar')
  similar(@Param('slug') slug: string) {
    return this.carsService.getSimilar(slug);
  }

  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.carsService.getPublicBySlug(slug);
  }
}
