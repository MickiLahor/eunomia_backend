import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { AsignacionService } from '../service/asignacion.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchAsignacionDto } from 'src/common/dtos/search.dto';


@Controller('asignacion')
export class AsignacionController {
  constructor(
    private readonly asignacionService: AsignacionService
    ) {

    }

    @Get()
    findAll(@Query() paginationDto :PaginationDto) {
      const {limit = 10,page= 1} = paginationDto

      return this.asignacionService.findAll({
        limit:limit,
        page:page,
        // route: "http://192.168.6.138:3000/api/v1/asignacion"
      });
    }

  @Get("search")
  search(@Query() searchDto :SearchAsignacionDto) {
    const {limit = 5,page= 1} = searchDto
    return this.asignacionService.search
    (
      {
        limit:limit,
        page:page,
        // route: "http://192.168.6.138:3000/api/v1/asignacion"
      }
      ,searchDto
    )
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.asignacionService.findOne(id);
  }
}
