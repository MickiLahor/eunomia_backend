import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsignacionEstadoService } from '../service/asignacion_estado.service';
import { CreateApersonamientoDefensor, CreateAsignacionEstadoDto } from '../dto/create-asignacion_estado.dto';
import { UpdateAsignacionEstadoDto } from '../dto/update-asignacion_estado.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('asignacion-estado')
export class AsignacionEstadoController {
  constructor(private readonly asignacionEstadoService: AsignacionEstadoService) {}

  @Post()
  @Auth(ValidRoles.administrador)
  create(@Body() createAsignacionEstadoDto: CreateAsignacionEstadoDto) {
    return this.asignacionEstadoService.create(createAsignacionEstadoDto);
  }

  @Get()
  @Auth(ValidRoles.administrador)
  findAll() {
    return this.asignacionEstadoService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.administrador)
  findOne(@Param('id') id: string) {
    return this.asignacionEstadoService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador)
  update(@Param('id') id: string, @Body() updateAsignacionEstadoDto: UpdateAsignacionEstadoDto) {
    return this.asignacionEstadoService.update(id, updateAsignacionEstadoDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrador)
  remove(@Param('id') id: string) {
    return this.asignacionEstadoService.remove(+id);
  }

  @Post('apersonamiento')
  apersonamientoDefensor(@Body() createApersonamientoDefensorDto: CreateApersonamientoDefensor) {
    return this.asignacionEstadoService.apersonamientoDefensor(createApersonamientoDefensorDto);
  }
}
