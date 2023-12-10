import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TipoInformeService } from '../service/tipo_informe.service';
import { CreateTipoInformeDto } from '../dto/create-tipo_informe.dto';
import { UpdateTipoInformeDto } from '../dto/update-tipo_informe.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators';

@Controller('tipo-informe')
export class TipoInformeController {
  constructor(private readonly tipoInformeService: TipoInformeService) {}

  @Post()
  @Auth(ValidRoles.administrador, ValidRoles.ssjjn)
  create(@Body() createTipoInformeDto: CreateTipoInformeDto) {
    return this.tipoInformeService.create(createTipoInformeDto);
  }

  @Get()
  @Auth(ValidRoles.administrador, ValidRoles.ssjjn)
  findAll() {
    return this.tipoInformeService.findAll();
  }

  @Get('select')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn, ValidRoles.defensor)
  findAllSelect() {
    return this.tipoInformeService.findAllSelect();
  }

  @Get(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjjn)
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.tipoInformeService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjjn)
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateTipoInformeDto: UpdateTipoInformeDto) {
    return this.tipoInformeService.update(id, updateTipoInformeDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrador)
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.tipoInformeService.remove(id);
  }
}
