import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TipoExcusaService } from '../service/tipo-excusa.service';
import { CreateTipoExcusaDto } from '../dto/create-tipo-excusa.dto';
import { UpdateTipoExcusaDto } from '../dto/update-tipo-excusa.dto';

@Controller('tipoexcusa')
export class TipoExcusaController {
  constructor(private readonly tipoExcusaService: TipoExcusaService) {}

  @Post()
  create(@Body() createTipoExcusaDto: CreateTipoExcusaDto) {
    return this.tipoExcusaService.create(createTipoExcusaDto);
  }

  @Get()
  findAll() {
    return this.tipoExcusaService.findAll();
  }

  @Get('select')
  findAllSelect() {
    return this.tipoExcusaService.findAllSelect();
  }

  @Get(':id')
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.tipoExcusaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateTipoExcusaDto: UpdateTipoExcusaDto) {
    return this.tipoExcusaService.update(id, updateTipoExcusaDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.tipoExcusaService.remove(id);
  }
}
