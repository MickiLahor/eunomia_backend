import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { RolesService } from '../service/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Auth(ValidRoles.administrador)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador)
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrador)
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
