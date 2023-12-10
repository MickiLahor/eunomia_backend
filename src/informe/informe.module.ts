import { Module } from '@nestjs/common';
import { InformeService } from './service/informe.service';
import { InformeController } from './controller/informe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Informe } from './entities/informe.entity';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { AsignacionModule } from 'src/asignacion/asignacion.module';
import { TipoInformeModule } from 'src/tipo_informe/tipo_informe.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [InformeController],
  providers: [InformeService],
  imports: [
    TypeOrmModule.forFeature([Informe,Asignacion]), 
    AsignacionModule, 
    TipoInformeModule,
    UsuariosModule
  ],
  exports: [InformeService]
})
export class InformeModule {}
