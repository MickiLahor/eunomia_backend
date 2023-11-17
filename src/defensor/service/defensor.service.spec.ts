import { Test, TestingModule } from '@nestjs/testing';
import { DefensorService } from './defensor.service';

describe('DefensorService', () => {
  let service: DefensorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefensorService],
    }).compile();

    service = module.get<DefensorService>(DefensorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
