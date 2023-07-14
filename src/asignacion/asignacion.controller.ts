import { Controller, Get } from '@nestjs/common';
import { AsignacionService } from './asignacion.service';


@Controller('asignacion')
export class AsignacionController {
  constructor(
    private readonly asignacionService: AsignacionService
    ) {

    }

    @Get()
    findAll() {
      return this.asignacionService.findAll();
    }
}
