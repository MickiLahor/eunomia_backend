import { Controller, Get, Post, Body,HttpCode, Patch, ParseUUIDPipe, Param } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateAuthDto, ResetPasswordUserDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { LoginDto } from '../dto/login.dto';
import { Auth, GetUser } from '../decorators';
import { ValidRoles } from '../interfaces';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { CreatePersonaUsuarioDto } from '../dto/create-persona-usuario.dto';
import { HttpStatusCode } from 'axios';
import { UpdatePersonaUsuarioDto } from '../dto/update-persona-usuario.dto';
import { SegipDto } from '../dto/segip.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post()
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  create(@Body() createUsuarioDto: CreateAuthDto) {
    return this.authService.create(createUsuarioDto);
  }

  @Post("create")
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  createAll(@Body() createPersonaUsuarioDto: CreatePersonaUsuarioDto) {
    return this.authService.createAll(createPersonaUsuarioDto);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updatePersonaUsuarioDto: UpdatePersonaUsuarioDto) {
    return this.authService.updateAll(id, updatePersonaUsuarioDto);
  }

  @Post("reset")
  @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
  resetPassword(@Body() resetPasswordUserDto: ResetPasswordUserDto) {
    return this.authService.resetPassword(resetPasswordUserDto);
  }


  @Post("login")
  @HttpCode(HttpStatusCode.Ok)
  login(@Body() loginUsuarioDto: LoginDto) {
    return this.authService.login(loginUsuarioDto);
  }

  @Get("private3")
  @Auth(ValidRoles.administrador)
  privateRoute3(
      @GetUser() user: Usuario,
    ) {
      return {
        ok:true,
        user
      };
    }

    @Post("segip")
    @Auth(ValidRoles.administrador, ValidRoles.ssjj, ValidRoles.ssjjn)
    segipConsulta(@Body() segipDto: SegipDto) {
      return this.authService.buscarSegip(segipDto);
    }
}
