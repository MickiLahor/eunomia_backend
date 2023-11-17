import { Module, forwardRef } from '@nestjs/common';
import { UsuariosService } from './service/usuarios.service';
import { UsuariosController } from './controller/usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Persona } from 'src/persona/entities/persona.entity';
import { PersonaModule } from 'src/persona/persona.module';
import { RolesModule } from 'src/roles/roles.module';
import { Rol } from 'src/roles/entities/rol.entity';
import { CommonModule } from 'src/common/common.module';


@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports:
        [
          TypeOrmModule.forFeature([ Usuario,Persona, Rol ]),
          forwardRef(() => PersonaModule),
          forwardRef(() => CommonModule),
          RolesModule,
        ],
        exports: [ TypeOrmModule, UsuariosService ]
})
export class UsuariosModule {}
