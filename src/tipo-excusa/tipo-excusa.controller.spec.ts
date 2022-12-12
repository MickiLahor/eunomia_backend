import { Test, TestingModule } from '@nestjs/testing';
import { TipoExcusaController } from './tipo-excusa.controller';
import { TipoExcusaService } from './tipo-excusa.service';

describe('TipoExcusaController', () => {
  let controller: TipoExcusaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoExcusaController],
      providers: [TipoExcusaService],
    }).compile();

    controller = module.get<TipoExcusaController>(TipoExcusaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
