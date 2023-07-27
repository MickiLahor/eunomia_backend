import { Module } from '@nestjs/common';
import { AsignacionEstadoService } from './asignacion_estado.service';
import { AsignacionEstadoController } from './asignacion_estado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionEstado } from './entities/asignacion_estado.entity';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { Estado } from 'src/estado/entities/estado.entity';
import { EstadoModule } from 'src/estado/estado.module';
import { AsignacionModule } from 'src/asignacion/asignacion.module';

@Module({
  controllers: [AsignacionEstadoController],
  providers: [AsignacionEstadoService],
  imports: [TypeOrmModule.forFeature([AsignacionEstado, Asignacion, Estado]),
  EstadoModule,
  AsignacionModule],
  exports: [AsignacionEstadoService]
})
export class AsignacionEstadoModule {}
