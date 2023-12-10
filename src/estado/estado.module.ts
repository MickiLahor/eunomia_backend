import { Module } from '@nestjs/common';
import { EstadoService } from './service/estado.service';
import { EstadoController } from './controller/estado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estado } from './entities/estado.entity';
import { AsignacionEstado } from 'src/asignacion_estado/entities/asignacion_estado.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [EstadoController],
  providers: [EstadoService],
  imports: [
    TypeOrmModule.forFeature([Estado, AsignacionEstado]),
    UsuariosModule
  ],
  exports: [EstadoService]
})
export class EstadoModule {}
