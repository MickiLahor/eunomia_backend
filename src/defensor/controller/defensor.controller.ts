import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchDefendorDto } from 'src/common/dtos/search.dto';
import { DefensorService } from '../service/defensor.service';
import { CreateDefensorDto } from '../dto/create-defensor.dto';
import { UpdateDefensorDto } from '../dto/update-defensor.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('defensor')
export class DefensorController {
  constructor(private readonly defensorService: DefensorService) {}

  @Post()
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  create(@Body() createDefensorDto: CreateDefensorDto) {
    return this.defensorService.create(createDefensorDto);
  }

  @Get('servicios')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAllServicios() {
    return this.defensorService.findAllServicios();
  }

  @Get()
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAll(@Query() paginationDto :PaginationDto) {
    const {limit = 10,page= 1} = paginationDto
    return this.defensorService.findAll({
      limit:limit,
      page:page,
    });
  }

  @Get("search")
  @Auth(ValidRoles.administrador, ValidRoles.ssjjn)
  search(@Query() searchDto :SearchDefendorDto) {
    const {limit = 10,page= 1} = searchDto
    return this.defensorService.search({
      limit:limit,
      page:page,
    }
    ,searchDto
    )
  }

  @Get("search-departamento")
  @Auth(ValidRoles.ssjj)
  searchDepartamento(@Query() searchDto :SearchDefendorDto) {
    const {limit = 10,page= 1} = searchDto
    return this.defensorService.searchDepartamento({
      limit:limit,
      page:page,
    }
    ,searchDto
    )
  }

  @Get(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.defensorService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDefensorDto: UpdateDefensorDto) {
    return this.defensorService.update(id, updateDefensorDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.defensorService.remove(id);
  }
}
