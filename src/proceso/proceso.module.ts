import { Module, forwardRef } from '@nestjs/common';
import { ProcesoService } from './service/proceso.service';
import { ProcesoController } from './controller/proceso.controller';
import { Materia } from 'src/materia/entities/materia.entity';
import { Proceso } from './entities/proceso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MateriaModule } from 'src/materia/materia.module';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { DefensorModule } from 'src/defensor/defensor.module';
import { AsignacionModule } from 'src/asignacion/asignacion.module';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AsignacionEstadoModule } from 'src/asignacion_estado/asignacion_estado.module';
import { EstadoModule } from 'src/estado/estado.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProcesoController],
  providers: [ProcesoService],
  imports: [TypeOrmModule.forFeature([ Proceso,Materia,Asignacion ]),
            MateriaModule,
            DefensorModule, 
            AsignacionModule, 
            CommonModule, 
            ConfigModule,
            AsignacionEstadoModule,
            EstadoModule
            ],
  exports:[ProcesoService]
})
export class ProcesoModule {}
