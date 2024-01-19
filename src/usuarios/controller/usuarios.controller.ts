import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseUUIDPipe, } from '@nestjs/common';
import { UsuariosService } from '../service/usuarios.service';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { UpdateRolUsuarioDto } from '../dto/update-rol-usuario.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchUsuarioDto } from 'src/common/dtos/search.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAll(@Query() paginationDto :PaginationDto) {
    const {limit = 10,page= 1} = paginationDto
    return this.usuariosService.findAll({
      limit:limit,
      page:page,
    });
  }

  @Get("search")
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  search(@Query() searchDto :SearchUsuarioDto) {
    const {limit = 10,page= 1} = searchDto
    return this.usuariosService.search({
      limit:limit,
      page:page,
    }, searchDto
    )
  }

  @Get("search-departamento")
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  searchDepartamento(@Query() searchDto :SearchUsuarioDto) {
    const {limit = 10,page= 1} = searchDto
    return this.usuariosService.searchDepartamento({
      limit:limit,
      page:page,
    }, searchDto
    )
  }

  @Get(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Patch('asignar-rol/:id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  asignarRoles(@Param('id') id: string, @Body() updateRolUsuarioDto: UpdateRolUsuarioDto) {
    return this.usuariosService.asignarRoles(id, updateRolUsuarioDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrador)
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.usuariosService.remove(id);
  }
}
