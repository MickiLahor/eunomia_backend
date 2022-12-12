import { Test, TestingModule } from '@nestjs/testing';
import { TipoprocesoService } from './tipoproceso.service';

describe('TipoprocesoService', () => {
  let service: TipoprocesoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoprocesoService],
    }).compile();

    service = module.get<TipoprocesoService>(TipoprocesoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
