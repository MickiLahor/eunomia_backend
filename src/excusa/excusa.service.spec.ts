import { Test, TestingModule } from '@nestjs/testing';
import { ExcusaService } from './excusa.service';

describe('ExcusaService', () => {
  let service: ExcusaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcusaService],
    }).compile();

    service = module.get<ExcusaService>(ExcusaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
