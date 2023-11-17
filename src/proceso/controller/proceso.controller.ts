import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProcesoService } from '../service/proceso.service';
import { CreateProcesoDto } from '../dto/create-proceso.dto';
import { UpdateProcesoDto } from '../dto/update-proceso.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchProcesoDto } from 'src/common/dtos/search.dto';

@Controller('proceso')
export class ProcesoController {
  constructor(private readonly procesoService: ProcesoService) {}

  @Post()
  create(@Body() createProcesoDto: CreateProcesoDto) {
    return this.procesoService.create(createProcesoDto);
  }

  @Get()
  findAll(@Query() paginationDto :PaginationDto) {

    const {limit = 10,page= 1} = paginationDto

    return this.procesoService.findAll({
      limit:limit,
      page:page,
      // route: "http://192.168.6.137:3000/api/v1/proceso"
    });
  }

  @Get('all')
  listarTodo() {

    return this.procesoService.all();
  }

  @Get("search")
  search(@Query() searchDto :SearchProcesoDto) {
    const {limit = 5,page= 1} = searchDto
    return this.procesoService.search
    (
      {
        limit:limit,
        page:page,
        // route: "http://192.168.6.137:3000/api/v1/proceso"
      }
      ,searchDto
    )
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.procesoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProcesoDto: UpdateProcesoDto) {
    return this.procesoService.update(id, updateProcesoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.procesoService.remove(id);
  }
}
