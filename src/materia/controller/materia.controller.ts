import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { MateriaService } from '../service/materia.service';
import { CreateMateriaDto } from '../dto/create-materia.dto';
import { UpdateMateriaDto } from '../dto/update-materia.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('materia')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @Post()
  @Auth(ValidRoles.administrador)
  create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiaService.create(createMateriaDto);
  }

  @Get()
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAll() {
    return this.materiaService.findAll();
  }

  @Get('select')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAllSelect() {
    return this.materiaService.findAllSelect();
  }

  @Get(':id')
  @Auth(ValidRoles.administrador, ValidRoles.juzgado, ValidRoles.ssjj, ValidRoles.ssjjn)
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.materiaService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador)
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateMateriaDto: UpdateMateriaDto) {
    return this.materiaService.update(id, updateMateriaDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrador)
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.materiaService.remove(id);
  }
}
