import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActividadService } from '../service/actividad.service';
import { CreateActividadDto } from '../dto/create-actividad.dto';
import { UpdateActividadDto } from '../dto/update-actividad.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('actividad')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Post()
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn)
  create(@Body() createActividadDto: CreateActividadDto) {
    return this.actividadService.create(createActividadDto);
  }

  @Get()
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAll() {
    return this.actividadService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn, ValidRoles.defensor)
  findOne(@Param('id') id: string) {
    return this.actividadService.findOne(+id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn)
  update(@Param('id') id: string, @Body() updateActividadDto: UpdateActividadDto) {
    return this.actividadService.update(id, updateActividadDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrador)
  remove(@Param('id') id: string) {
    return this.actividadService.remove(+id);
  }

  @Get('asignacion/:id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn, ValidRoles.defensor)
  findByAsignacion(@Param('id') id: string) {
    return this.actividadService.findByAsignacion(id);
  }
}
