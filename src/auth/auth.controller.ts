import { Controller, Get, Post, Body,HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, ResetPasswordUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './interfaces';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { CreatePersonaUsuarioDto } from './dto/create-persona-usuario.dto';
import { HttpStatusCode } from 'axios';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post()
  create(@Body() createUsuarioDto: CreateAuthDto) {
    return this.authService.create(createUsuarioDto);
  }

  @Post("create")
  createAll(@Body() createPersonaUsuarioDto: CreatePersonaUsuarioDto) {
    return this.authService.createAll(createPersonaUsuarioDto);
  }

  @Post("reset")
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
}
