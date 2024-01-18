import { Controller, Get, Param } from '@nestjs/common';
import { CommonService } from './common.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('departamentos')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAllDepartamentos() {
    return this.commonService.getDepartamentoZeusPro();
  }

  @Get('municipios/:id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAllMunicipios(@Param('id') id: number) {
    return this.commonService.getMunicipioZeusPro(id);
  }

  @Get('oficinas/:id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAllOficinas(@Param('id') id: number) {
    return this.commonService.getOficinaZeusProPorMunicipio(id);
  }
}
