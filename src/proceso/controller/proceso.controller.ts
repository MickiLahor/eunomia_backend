import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProcesoService } from '../service/proceso.service';
import { CreateProcesoDto } from '../dto/create-proceso.dto';
import { UpdateProcesoDto } from '../dto/update-proceso.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchProcesoDto } from 'src/common/dtos/search.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ReporteProcesoDto } from '../dto/reporte-proceso.dto';

@Controller('proceso')
export class ProcesoController {
  constructor(private readonly procesoService: ProcesoService) {}

  @Post()
  @Auth(ValidRoles.administrador, ValidRoles.juzgado)
  create(@Body() createProcesoDto: CreateProcesoDto) {
    return this.procesoService.create(createProcesoDto);
  }

  @Get()
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAll(@Query() paginationDto :PaginationDto) {

    const {limit = 10,page= 1} = paginationDto

    return this.procesoService.findAll({
      limit:limit,
      page:page,
    });
  }

  @Get('all')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn)
  listarTodo() {

    return this.procesoService.all();
  }

  @Get("search")
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn)
  search(@Query() searchDto :SearchProcesoDto) {
    const {limit = 5,page= 1} = searchDto
    return this.procesoService.search
    (
      {
        limit:limit,
        page:page,
      }
      ,searchDto
    )
  }

  @Get('report')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn)
  findProcesoByFechaMateriaDistrito(@Query() reporteProcesoDto: ReporteProcesoDto) {
    reporteProcesoDto
    return this.procesoService.findProcesoByFechaMateriaDistrito
    (
      reporteProcesoDto
    )
  }

  @Get(':id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.procesoService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProcesoDto: UpdateProcesoDto) {
    return this.procesoService.update(id, updateProcesoDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.procesoService.remove(id);
  }
  
}
