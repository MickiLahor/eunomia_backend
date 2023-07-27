import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ExcusaService } from './excusa.service';
import { CreateExcusaDto } from './dto/create-excusa.dto';
import { UpdateExcusaDto } from './dto/update-excusa.dto';

@Controller('excusa')
export class ExcusaController {
  constructor(private readonly excusaService: ExcusaService) {}

  @Post()
  create(@Body() createExcusaDto: CreateExcusaDto) {
    return this.excusaService.create(createExcusaDto);
  }

  @Get()
  findAll() {
    return this.excusaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.excusaService.findOne(id);
  }

  @Get('asignacion/:id')
  findForAsignacion(@Param('id',ParseUUIDPipe) id: string) {
    return this.excusaService.findForAsignacion(id);
  }

  @Get('proceso/:id')
  findForProceso(@Param('id',ParseUUIDPipe) id: string) {
    return this.excusaService.findForProceso(id);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateExcusaDto: UpdateExcusaDto) {
    return this.excusaService.update(id, updateExcusaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.excusaService.remove(id);
  }
}
