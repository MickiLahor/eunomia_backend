import { Module } from '@nestjs/common';
import { InformeService } from './service/informe.service';
import { InformeController } from './controller/informe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Informe } from './entities/informe.entity';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { AsignacionModule } from 'src/asignacion/asignacion.module';
import { TipoInformeModule } from 'src/tipo_informe/tipo_informe.module';

@Module({
  controllers: [InformeController],
  providers: [InformeService],
  imports: [TypeOrmModule.forFeature([Informe,Asignacion]), AsignacionModule, TipoInformeModule],
  exports: [InformeService]
})
export class InformeModule {}
