import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseUUIDPipe, } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-rol-usuario.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchUsuarioDto } from 'src/common/dtos/search.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll(@Query() paginationDto :PaginationDto) {
    const {limit = 10,page= 1} = paginationDto
    return this.usuariosService.findAll
    (
      {
        limit:limit,
        page:page,
        route: "http://192.168.6.137:3000/api/v1/usuarios"
      });
  }

  @Get("search")
  search(@Query() searchDto :SearchUsuarioDto) {
    const {limit = 5,page= 1} = searchDto
    return this.usuariosService.search
    (
      {
        limit:limit,
        page:page,
        route: "http://192.168.6.137:3000/api/v1/usuarios"
      }
      ,searchDto
    )
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Patch('asignar-rol/:id')
  asignarRoles(@Param('id') id: string, @Body() updateRolUsuarioDto: UpdateRolUsuarioDto) {
    return this.usuariosService.asignarRoles(id, updateRolUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }

 

}
