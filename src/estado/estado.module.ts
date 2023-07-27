import { Module } from '@nestjs/common';
import { EstadoService } from './estado.service';
import { EstadoController } from './estado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estado } from './entities/estado.entity';
import { AsignacionEstado } from 'src/asignacion_estado/entities/asignacion_estado.entity';

@Module({
  controllers: [EstadoController],
  providers: [EstadoService],
  imports: [TypeOrmModule.forFeature([Estado, AsignacionEstado])],
  exports: [EstadoService]
})
export class EstadoModule {}
