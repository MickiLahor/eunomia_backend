import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TipoExcusaService } from '../service/tipo-excusa.service';
import { CreateTipoExcusaDto } from '../dto/create-tipo-excusa.dto';
import { UpdateTipoExcusaDto } from '../dto/update-tipo-excusa.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('tipoexcusa')
export class TipoExcusaController {
  constructor(private readonly tipoExcusaService: TipoExcusaService) {}

  @Post()
  @Auth(ValidRoles.administrador, ValidRoles.ssjjn)
  create(@Body() createTipoExcusaDto: CreateTipoExcusaDto) {
    return this.tipoExcusaService.create(createTipoExcusaDto);
  }

  @Get()
  @Auth(ValidRoles.administrador, ValidRoles.ssjjn)
  findAll() {
    return this.tipoExcusaService.findAll();
  }

  @Get('select')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn, ValidRoles.defensor)
  findAllSelect() {
    return this.tipoExcusaService.findAllSelect();
  }

  @Get(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjjn)
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.tipoExcusaService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjjn)
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateTipoExcusaDto: UpdateTipoExcusaDto) {
    return this.tipoExcusaService.update(id, updateTipoExcusaDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrador)
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.tipoExcusaService.remove(id);
  }
}
