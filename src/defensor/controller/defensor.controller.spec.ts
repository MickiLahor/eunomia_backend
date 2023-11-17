import { Test, TestingModule } from '@nestjs/testing';
import { DefensorController } from './defensor.controller';
import { DefensorService } from '../service/defensor.service';

describe('DefensorController', () => {
  let controller: DefensorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefensorController],
      providers: [DefensorService],
    }).compile();

    controller = module.get<DefensorController>(DefensorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
