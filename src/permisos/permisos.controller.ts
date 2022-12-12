import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Post()
  create(@Body() createPermisoDto: CreatePermisoDto) {
    return this.permisosService.create(createPermisoDto);
  }

  @Get()
  findAll(@Query() paginationDto :PaginationDto) {
    return this.permisosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.permisosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePermisoDto: UpdatePermisoDto) {
    return this.permisosService.update(id, updatePermisoDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.permisosService.remove(id);
  }
}
