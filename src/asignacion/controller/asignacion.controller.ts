import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { AsignacionService } from '../service/asignacion.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchAsignacionDto } from 'src/common/dtos/search.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';


@Controller('asignacion')
export class AsignacionController {
  constructor(
    private readonly asignacionService: AsignacionService
  ) {}

  @Get()
  @Auth(ValidRoles.administrador, ValidRoles.ssjjn)
  findAll(@Query() paginationDto :PaginationDto) {
    const {limit = 10,page= 1} = paginationDto

    return this.asignacionService.findAll({
      limit:limit,
      page:page,
    });
  }

  @Get("search")
  @Auth(ValidRoles.administrador, ValidRoles.ssjjn)
  search(@Query() searchDto :SearchAsignacionDto) {
    const {limit = 10,page= 1} = searchDto
    return this.asignacionService.search
    (
      {
        limit:limit,
        page:page,
      }
      ,searchDto
    )
  }

  @Get("search-departamento")
  @Auth(ValidRoles.ssjj)
  searchDepartamento(@Query() searchDto :SearchAsignacionDto) {
    const {limit = 10,page= 1} = searchDto
    return this.asignacionService.searchDepartamento
    (
      {
        limit:limit,
        page:page,
      }
      ,searchDto
    )
  }

  @Get("search-oficina")
  @Auth(ValidRoles.juzgado)
  searchOficina(@Query() searchDto :SearchAsignacionDto) {
    const {limit = 10,page= 1} = searchDto
    return this.asignacionService.searchOficina
    (
      {
        limit:limit,
        page:page,
      }
      ,searchDto
    )
  }

  @Get("search-defensor")
  @Auth(ValidRoles.defensor)
  searchDefensor(@Query() searchDto :SearchAsignacionDto) {
    const {limit = 10,page= 1} = searchDto
    return this.asignacionService.searchDefensor
    (
      {
        limit:limit,
        page:page,
      }
      ,searchDto
    )
  }

  @Get(':id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn, ValidRoles.defensor)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.asignacionService.findOne(id);
  }
}
