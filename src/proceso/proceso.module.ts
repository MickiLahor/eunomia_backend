import { Module } from '@nestjs/common';
import { ProcesoService } from './proceso.service';
import { ProcesoController } from './proceso.controller';
import { Materia } from 'src/materia/entities/materia.entity';
import { Proceso } from './entities/proceso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MateriaModule } from 'src/materia/materia.module';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { DefensorModule } from 'src/defensor/defensor.module';
import { AsignacionModule } from 'src/asignacion/asignacion.module';

@Module({
  controllers: [ProcesoController],
  providers: [ProcesoService],
  imports: [TypeOrmModule.forFeature([ Proceso,Materia,Asignacion ]),
            MateriaModule,
            DefensorModule,
            AsignacionModule],
  exports: [ProcesoService]
})
export class ProcesoModule {}
