import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Defensor } from 'src/defensor/entities/defensor.entity';
import { Excusa } from 'src/excusa/entities/excusa.entity';
import { Proceso } from 'src/proceso/entities/proceso.entity';
import { AsignacionService } from './service/asignacion.service';
import { Asignacion } from './entities/asignacion.entity';
import { AsignacionController } from './controller/asignacion.controller';
import { AsignacionEstado } from 'src/asignacion_estado/entities/asignacion_estado.entity';
import { CommonModule } from 'src/common/common.module';
import { Actividad } from 'src/actividad/entities/actividad.entity';

@Module({
  controllers:[AsignacionController],
  providers: [AsignacionService],
  imports: [
    TypeOrmModule.forFeature([Asignacion, Proceso, Defensor, Excusa, AsignacionEstado, Actividad]),
    CommonModule
  ],
  exports: [AsignacionService]
})
export class AsignacionModule {}
