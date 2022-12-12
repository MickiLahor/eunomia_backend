import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Persona } from 'src/persona/entities/persona.entity';
import { PersonaModule } from 'src/persona/persona.module';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports:
        [
          TypeOrmModule.forFeature([ Usuario,Persona ]),
          PersonaModule
        ]
})
export class UsuariosModule {}
