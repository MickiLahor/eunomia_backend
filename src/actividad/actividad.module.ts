import { Module } from '@nestjs/common';
import { ActividadService } from './service/actividad.service';
import { ActividadController } from './controller/actividad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { AsignacionModule } from 'src/asignacion/asignacion.module';
import { Actividad } from './entities/actividad.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ActividadController],
  providers: [ActividadService],
  imports: [
    TypeOrmModule.forFeature([Actividad, Asignacion]),
    AsignacionModule,
    UsuariosModule
  ],
  exports:[ActividadService]
})
export class ActividadModule {}
