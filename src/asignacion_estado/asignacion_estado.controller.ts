import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsignacionEstadoService } from './asignacion_estado.service';
import { CreateAsignacionEstadoDto } from './dto/create-asignacion_estado.dto';
import { UpdateAsignacionEstadoDto } from './dto/update-asignacion_estado.dto';

@Controller('asignacion-estado')
export class AsignacionEstadoController {
  constructor(private readonly asignacionEstadoService: AsignacionEstadoService) {}

  @Post()
  create(@Body() createAsignacionEstadoDto: CreateAsignacionEstadoDto) {
    return this.asignacionEstadoService.create(createAsignacionEstadoDto);
  }

  @Get()
  findAll() {
    return this.asignacionEstadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asignacionEstadoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAsignacionEstadoDto: UpdateAsignacionEstadoDto) {
    return this.asignacionEstadoService.update(+id, updateAsignacionEstadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asignacionEstadoService.remove(+id);
  }
}
