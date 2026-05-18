import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get('health')
  health() {
    return this.appService.getHealth();
  }

  @Get('settings')
  settings() {
    return {
      whatsappPhone: this.configService.get<string>(
        'WHATSAPP_PHONE',
        '+22900000000',
      ),
      currency: this.configService.get<string>('CURRENCY', 'XOF'),
    };
  }
}
