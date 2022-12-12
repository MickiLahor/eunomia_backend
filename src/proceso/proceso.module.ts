import { Module } from '@nestjs/common';
import { ProcesoService } from './proceso.service';
import { ProcesoController } from './proceso.controller';
import { TipoProceso } from 'src/tipoproceso/entities/tipoproceso.entity';
import { Proceso } from './entities/proceso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoProcesoModule } from 'src/tipoproceso/tipoproceso.module';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { DefensorModule } from 'src/defensor/defensor.module';
import { AsignacionModule } from 'src/asignacion/asignacion.module';

@Module({
  controllers: [ProcesoController],
  providers: [ProcesoService],
  imports: [TypeOrmModule.forFeature([ Proceso,TipoProceso,Asignacion ]),
            TipoProcesoModule,
            DefensorModule, AsignacionModule]
})
export class ProcesoModule {}
