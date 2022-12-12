import { Test, TestingModule } from '@nestjs/testing';
import { ProcesoService } from './proceso.service';

describe('ProcesoService', () => {
  let service: ProcesoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcesoService],
    }).compile();

    service = module.get<ProcesoService>(ProcesoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
