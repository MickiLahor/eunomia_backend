import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchDto } from 'src/common/dtos/search.dto';

@Controller('persona')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post()
  create(@Body() createPersonaDto: CreatePersonaDto) {
    return this.personaService.create(createPersonaDto);
  }

  @Get()
  findAll(@Query() paginationDto :PaginationDto) {
    const {limit = 10,page= 1} = paginationDto
    return this.personaService.findAll
    (
      {
        limit:limit,
        page:page,
        route: "http://192.168.5.35:3000/api/v1/persona"
      });
  }

  @Get('nodefensor')
  listarNoDefensor(@Query() paginationDto :PaginationDto) {
    const {limit = 10,page= 1} = paginationDto
    return this.personaService.listarNoDefensor
    (
      {
        limit:limit,
        page:page,
        route: "http://192.168.5.35:3000/api/v1/persona"
      });
  }

  @Get("search")
  search(@Query() searchDto :SearchDto) {
    const {limit = 5,page= 1} = searchDto
    return this.personaService.search
    (
      {
        limit:limit,
        page:page,
        route: "http://192.168.5.35:3000/api/v1/persona"
      }
      ,searchDto
    )
  }

  @Get(':id')
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.personaService.findOne(id);
  }

  @Get('ci/:id')
  findOneCi(@Param('id') id: string) {
    return this.personaService.findOneCi(id);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updatePersonaDto: UpdatePersonaDto) {
    return this.personaService.update(id, updatePersonaDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.personaService.remove(id);
  }
}
