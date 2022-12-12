import { Module } from '@nestjs/common';

import { TipoProcesoController } from './tipoproceso.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoProceso } from './entities/tipoproceso.entity';
import { TipoProcesoService } from './tipoproceso.service';
import { Proceso } from 'src/proceso/entities/proceso.entity';

@Module({
  controllers: [TipoProcesoController],
  providers: [TipoProcesoService],
  imports: [TypeOrmModule.forFeature([ TipoProceso,Proceso ])],
  exports: [TipoProcesoService]
})
export class TipoProcesoModule {}
