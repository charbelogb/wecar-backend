import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CustomRequestsService } from './custom-requests.service';
import { CreateCustomRequestDto } from './dto/create-custom-request.dto';

@Controller('custom-requests')
export class CustomRequestsController {
  constructor(private readonly customRequestsService: CustomRequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCustomRequestDto) {
    return this.customRequestsService.create(dto);
  }
}
