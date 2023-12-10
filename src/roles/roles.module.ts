import { Module, forwardRef } from '@nestjs/common';
import { RolesService } from './service/roles.service';
import { RolesController } from './controller/roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports:[TypeOrmModule.forFeature([ Rol,Permiso]), forwardRef(() => UsuariosModule)],
  exports: [RolesService]
})
export class RolesModule {}
