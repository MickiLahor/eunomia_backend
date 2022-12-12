import { Test, TestingModule } from '@nestjs/testing';
import { ExcusaController } from './excusa.controller';
import { ExcusaService } from './excusa.service';

describe('ExcusaController', () => {
  let controller: ExcusaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcusaController],
      providers: [ExcusaService],
    }).compile();

    controller = module.get<ExcusaController>(ExcusaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
