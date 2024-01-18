import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PersonaService } from '../service/persona.service';
import { CreatePersonaDto } from '../dto/create-persona.dto';
import { UpdatePersonaDto } from '../dto/update-persona.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchDto } from 'src/common/dtos/search.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators';

@Controller('persona')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post()
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  create(@Body() createPersonaDto: CreatePersonaDto) {
    return this.personaService.create(createPersonaDto);
  }

  @Get()
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAll(@Query() paginationDto :PaginationDto) {
    const {limit = 10,page= 1} = paginationDto
    return this.personaService.findAll({
      limit:limit,
      page:page,
    });
  }

  @Get('nodefensor')
  @Auth(ValidRoles.administrador,ValidRoles.ssjj, ValidRoles.ssjjn)
  listarNoDefensor(@Query() paginationDto :PaginationDto) {
    const {limit = 10,page= 1} = paginationDto
    return this.personaService.listarNoDefensor
    (
      {
        limit:limit,
        page:page,
        // route: "http://192.168.6.138:3000/api/v1/persona"
      });
  }

  @Get("search")
  @Auth(ValidRoles.administrador, ValidRoles.ssjjn)
  search(@Query() searchDto :SearchDto) {
    const {limit = 5,page= 1} = searchDto
    return this.personaService.search({
      limit:limit,
      page:page,
    }, searchDto
    )
  }

  @Get("search-departamento")
  @Auth(ValidRoles.ssjj)
  searchDepartamento(@Query() searchDto :SearchDto) {
    const {limit = 5,page= 1} = searchDto
    return this.personaService.searchDepartamento({
      limit:limit,
      page:page,
    }, searchDto
    )
  }

  @Get(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.personaService.findOne(id);
  }

  @Get('ci/:id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findOneCi(@Param('id') id: string) {
    return this.personaService.findOneCi(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updatePersonaDto: UpdatePersonaDto) {
    return this.personaService.update(id, updatePersonaDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.personaService.remove(id);
  }
}
