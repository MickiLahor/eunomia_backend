import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionEstadoService } from './asignacion_estado.service';

describe('AsignacionEstadoService', () => {
  let service: AsignacionEstadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsignacionEstadoService],
    }).compile();

    service = module.get<AsignacionEstadoService>(AsignacionEstadoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
