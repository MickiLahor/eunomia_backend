import { Module } from '@nestjs/common';
import { NotificacionService } from './service/notificacion.service';
import { NotificacionController } from './controller/notificacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { Notificacion } from './entities/notificacion.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [NotificacionController],
  providers: [NotificacionService],
  imports: [
    TypeOrmModule.forFeature([Asignacion, Notificacion]),
    UsuariosModule
  ],
  exports: [NotificacionService]
})
export class NotificacionModule {}
