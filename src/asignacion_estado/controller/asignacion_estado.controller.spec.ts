import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionEstadoController } from './asignacion_estado.controller';
import { AsignacionEstadoService } from '../service/asignacion_estado.service';

describe('AsignacionEstadoController', () => {
  let controller: AsignacionEstadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsignacionEstadoController],
      providers: [AsignacionEstadoService],
    }).compile();

    controller = module.get<AsignacionEstadoController>(AsignacionEstadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
