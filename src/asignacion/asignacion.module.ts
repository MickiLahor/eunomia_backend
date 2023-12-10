import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Defensor } from 'src/defensor/entities/defensor.entity';
import { Excusa } from 'src/excusa/entities/excusa.entity';
import { Proceso } from 'src/proceso/entities/proceso.entity';
import { AsignacionService } from './service/asignacion.service';
import { Asignacion } from './entities/asignacion.entity';
import { AsignacionController } from './controller/asignacion.controller';
import { AsignacionEstado } from 'src/asignacion_estado/entities/asignacion_estado.entity';
import { CommonModule } from 'src/common/common.module';
import { Actividad } from 'src/actividad/entities/actividad.entity';
import { MailModule } from 'src/mail/mail.module';
import { Notificacion } from 'src/notificacion/entities/notificacion.entity';
import { NotificacionModule } from 'src/notificacion/notificacion.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers:[AsignacionController],
  providers: [AsignacionService],
  imports: [
    TypeOrmModule.forFeature([Asignacion, Proceso, Defensor, Excusa, AsignacionEstado, Actividad, Notificacion]),
    CommonModule,
    MailModule,
    NotificacionModule,
    UsuariosModule,
  ],
  exports: [AsignacionService]
})
export class AsignacionModule {}
