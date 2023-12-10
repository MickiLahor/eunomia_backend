import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { EstadoService } from '../service/estado.service';
import { CreateEstadoDto } from '../dto/create-estado.dto';
import { UpdateEstadoDto } from '../dto/update-estado.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('estado')
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}

  @Post()
  @Auth(ValidRoles.administrador)
  create(@Body() createEstadoDto: CreateEstadoDto) {
    return this.estadoService.create(createEstadoDto);
  }

  @Get()
  @Auth(ValidRoles.administrador)
  findAll() {
    return this.estadoService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.administrador)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.estadoService.findOne(id);
  }

  @Get('descripcion/:id')
  @Auth(ValidRoles.administrador)
  findOneDescripcion(@Param('id') id: string) {
    return this.estadoService.findOneDescripcion(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador)
  update(@Param('id') id: string, @Body() updateEstadoDto: UpdateEstadoDto) {
    return this.estadoService.update(+id, updateEstadoDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrador)
  remove(@Param('id') id: string) {
    return this.estadoService.remove(+id);
  }
}
