import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchDefendorDto } from 'src/common/dtos/search.dto';
import { DefensorService } from '../service/defensor.service';
import { CreateDefensorDto } from '../dto/create-defensor.dto';
import { UpdateDefensorDto } from '../dto/update-defensor.dto';

@Controller('defensor')
export class DefensorController {
  constructor(private readonly defensorService: DefensorService) {}

  @Post()
  create(@Body() createDefensorDto: CreateDefensorDto) {
    return this.defensorService.create(createDefensorDto);
  }

  @Get('servicios')
  findAllServicios() {
    return this.defensorService.findAllServicios();
  }

  @Get()
  findAll(@Query() paginationDto :PaginationDto) {
    const {limit = 10,page= 1} = paginationDto
    return this.defensorService.findAll
    (
      {
        limit:limit,
        page:page,
        // route: "http://192.168.6.138:3000/api/v1/defensor"
      });
  }

  @Get("search")
  search(@Query() searchDto :SearchDefendorDto) {
    const {limit = 10,page= 1} = searchDto
    return this.defensorService.search
    (
      {
        limit:limit,
        page:page,
        // route: "http://192.168.6.138:3000/api/v1/persona"
      }
      ,searchDto
    )
  }


  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.defensorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDefensorDto: UpdateDefensorDto) {
    return this.defensorService.update(id, updateDefensorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.defensorService.remove(id);
  }
}
