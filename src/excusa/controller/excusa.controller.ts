import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ExcusaService } from '../service/excusa.service';
import { CreateExcusaDto } from '../dto/create-excusa.dto';
import { UpdateExcusaDto } from '../dto/update-excusa.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('excusa')
export class ExcusaController {
  constructor(private readonly excusaService: ExcusaService) {}

  @Post()
  @Auth(ValidRoles.administrador, ValidRoles.defensor)
  create(@Body() createExcusaDto: CreateExcusaDto) {
    return this.excusaService.create(createExcusaDto);
  }

  @Get()
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAll() {
    return this.excusaService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn, ValidRoles.defensor)
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.excusaService.findOne(id);
  }

  @Get('asignacion/:id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn, ValidRoles.defensor)
  findForAsignacion(@Param('id',ParseUUIDPipe) id: string) {
    return this.excusaService.findForAsignacion(id);
  }

  @Get('proceso/:id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn)
  findForProceso(@Param('id',ParseUUIDPipe) id: string) {
    return this.excusaService.findForProceso(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador, ValidRoles.defensor)
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateExcusaDto: UpdateExcusaDto) {
    return this.excusaService.update(id, updateExcusaDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrador)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.excusaService.remove(id);
  }
}
