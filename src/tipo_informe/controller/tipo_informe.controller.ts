import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TipoInformeService } from '../service/tipo_informe.service';
import { CreateTipoInformeDto } from '../dto/create-tipo_informe.dto';
import { UpdateTipoInformeDto } from '../dto/update-tipo_informe.dto';

@Controller('tipo-informe')
export class TipoInformeController {
  constructor(private readonly tipoInformeService: TipoInformeService) {}

  @Post()
  create(@Body() createTipoInformeDto: CreateTipoInformeDto) {
    return this.tipoInformeService.create(createTipoInformeDto);
  }

  @Get()
  findAll() {
    return this.tipoInformeService.findAll();
  }

  @Get('select')
  findAllSelect() {
    return this.tipoInformeService.findAllSelect();
  }

  @Get(':id')
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.tipoInformeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateTipoInformeDto: UpdateTipoInformeDto) {
    return this.tipoInformeService.update(id, updateTipoInformeDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.tipoInformeService.remove(id);
  }
}
