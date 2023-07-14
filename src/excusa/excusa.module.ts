import { Module } from '@nestjs/common';
import { ExcusaService } from './excusa.service';
import { ExcusaController } from './excusa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Excusa } from './entities/excusa.entity';
import { TipoExcusa } from 'src/tipo-excusa/entities/tipo-excusa.entity';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { TipoExcusaModule } from 'src/tipo-excusa/tipo-excusa.module';
import { AsignacionModule } from 'src/asignacion/asignacion.module';

@Module({
  controllers: [ExcusaController],
  providers: [ExcusaService],
  imports: [TypeOrmModule.forFeature([ Excusa, TipoExcusa, Asignacion]),
            TipoExcusaModule,
            AsignacionModule],
  exports:[ExcusaService]
})
export class ExcusaModule {}
