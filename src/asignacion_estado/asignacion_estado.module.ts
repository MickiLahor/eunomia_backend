import { Module } from '@nestjs/common';
import { AsignacionEstadoService } from './service/asignacion_estado.service';
import { AsignacionEstadoController } from './controller/asignacion_estado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionEstado } from './entities/asignacion_estado.entity';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { Estado } from 'src/estado/entities/estado.entity';
import { EstadoModule } from 'src/estado/estado.module';
import { AsignacionModule } from 'src/asignacion/asignacion.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AsignacionEstadoController],
  providers: [AsignacionEstadoService],
  imports: [TypeOrmModule.forFeature([AsignacionEstado, Asignacion, Estado]),
    EstadoModule,
    AsignacionModule,
    UsuariosModule
  ],
  exports: [AsignacionEstadoService]
})
export class AsignacionEstadoModule {}
