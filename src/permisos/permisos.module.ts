import { Module } from '@nestjs/common';
import { PermisosService } from './service/permisos.service';
import { PermisosController } from './controller/permisos.controller';
import { Permiso } from './entities/permiso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [PermisosController],
  providers: [PermisosService],
  imports: [
    TypeOrmModule.forFeature([ Permiso ]),
    UsuariosModule
  ]
})
export class PermisosModule {}
