import { Test, TestingModule } from '@nestjs/testing';
import { TipoProcesoController } from './tipoproceso.controller';
import { TipoProcesoService } from './tipoproceso.service';

describe('TipoprocesoController', () => {
  let controller: TipoProcesoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoProcesoController],
      providers: [TipoProcesoService],
    }).compile();

    controller = module.get<TipoProcesoController>(TipoProcesoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
