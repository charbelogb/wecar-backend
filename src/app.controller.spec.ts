import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string, fallback?: string) => fallback ?? '',
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('returns application health payload', () => {
    const health = appController.health();
    expect(health.status).toBe('ok');
    expect(health.timestamp).toBeDefined();
  });

  it('returns settings', () => {
    const settings = appController.settings();
    expect(settings.whatsappPhone).toBeDefined();
    expect(settings.currency).toBeDefined();
  });
});
