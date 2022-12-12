import { Test, TestingModule } from '@nestjs/testing';
import { TipoExcusaService } from './tipo-excusa.service';

describe('TipoExcusaService', () => {
  let service: TipoExcusaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoExcusaService],
    }).compile();

    service = module.get<TipoExcusaService>(TipoExcusaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
