import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TipoProcesoService } from './tipoproceso.service';
import { CreateTipoProcesoDto } from './dto/create-tipoproceso.dto';
import { UpdateTipoProcesoDto } from './dto/update-tipoproceso.dto';

@Controller('tipoproceso')
export class TipoProcesoController {
  constructor(private readonly tipoprocesoService: TipoProcesoService) {}

  @Post()
  create(@Body() createTipoprocesoDto: CreateTipoProcesoDto) {
    return this.tipoprocesoService.create(createTipoprocesoDto);
  }

  @Get()
  findAll() {
    return this.tipoprocesoService.findAll();
  }

  @Get('select')
  findAllSelect() {
    return this.tipoprocesoService.findAllSelect();
  }

  @Get(':id')
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.tipoprocesoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateTipoprocesoDto: UpdateTipoProcesoDto) {
    return this.tipoprocesoService.update(id, updateTipoprocesoDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.tipoprocesoService.remove(id);
  }
}
