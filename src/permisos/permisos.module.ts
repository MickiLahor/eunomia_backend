import { Module } from '@nestjs/common';
import { PermisosService } from './service/permisos.service';
import { PermisosController } from './controller/permisos.controller';
import { Permiso } from './entities/permiso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PermisosController],
  providers: [PermisosService],
  imports:[TypeOrmModule.forFeature([ Permiso ])]
})
export class PermisosModule {}
