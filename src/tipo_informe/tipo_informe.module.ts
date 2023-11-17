import { Module } from '@nestjs/common';
import { TipoInformeService } from './service/tipo_informe.service';
import { TipoInformeController } from './controller/tipo_informe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoInforme } from './entities/tipo_informe.entity';
import { Informe } from 'src/informe/entities/informe.entity';

@Module({
  controllers: [TipoInformeController],
  providers: [TipoInformeService],
  imports: [TypeOrmModule.forFeature([ TipoInforme, Informe])],
  exports: [TipoInformeService]
})
export class TipoInformeModule {}
