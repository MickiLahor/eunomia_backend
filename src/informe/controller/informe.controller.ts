import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { InformeService } from '../service/informe.service';
import { CreateInformeDto } from '../dto/create-informe.dto';
import { UpdateInformeDto } from '../dto/update-informe.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('informe')
export class InformeController {
  constructor(private readonly informeService: InformeService) {}

  @Post()
  @Auth(ValidRoles.administrador, ValidRoles.defensor)
  create(@Body() createInformeDto: CreateInformeDto) {
    return this.informeService.create(createInformeDto);
  }

  @Get()
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAll() {
    return this.informeService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn, ValidRoles.defensor)
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.informeService.findOne(id);
  }

  @Get('asignacion/:id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn, ValidRoles.defensor)
  findForAsignacion(@Param('id',ParseUUIDPipe) id: string) {
    return this.informeService.findForAsignacion(id);
  }

  @Get('proceso/:id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn)
  findForProceso(@Param('id',ParseUUIDPipe) id: string) {
    return this.informeService.findForProceso(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador, ValidRoles.defensor)
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateInformeDto: UpdateInformeDto) {
    return this.informeService.update(id, updateInformeDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrador)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.informeService.remove(id);
  }
}
