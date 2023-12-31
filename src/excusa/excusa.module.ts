import { Module } from '@nestjs/common';
import { ExcusaService } from './service/excusa.service';
import { ExcusaController } from './controller/excusa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Excusa } from './entities/excusa.entity';
import { TipoExcusa } from 'src/tipo-excusa/entities/tipo-excusa.entity';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { TipoExcusaModule } from 'src/tipo-excusa/tipo-excusa.module';
import { AsignacionModule } from 'src/asignacion/asignacion.module';
import { DefensorModule } from 'src/defensor/defensor.module';
import { AsignacionEstadoModule } from 'src/asignacion_estado/asignacion_estado.module';
import { EstadoModule } from 'src/estado/estado.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [ExcusaController],
  providers: [ExcusaService],
  imports: [
    TypeOrmModule.forFeature([ Excusa, TipoExcusa, Asignacion]),
    TipoExcusaModule,
    AsignacionModule,
    DefensorModule,
    AsignacionEstadoModule,
    EstadoModule,
    UsuariosModule
  ],
  exports:[ExcusaService]
})
export class ExcusaModule {}
