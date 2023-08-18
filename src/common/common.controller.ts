import { Controller, Get, Param } from '@nestjs/common';
import { CommonService } from './common.service';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('departamentos')
  findAllDepartamentos() {
    return this.commonService.getDepartamentoZeusPro();
  }

  @Get('municipios/:id')
  findAllMunicipios(@Param('id') id: number) {
    return this.commonService.getMunicipioZeusPro(id);
  }

  @Get('oficinas/:id')
  findAllOficinas(@Param('id') id: number) {
    return this.commonService.getOficinaZeusProPorMunicipio(id);
  }
}
