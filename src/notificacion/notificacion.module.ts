import { Module } from '@nestjs/common';
import { NotificacionService } from './service/notificacion.service';
import { NotificacionController } from './controller/notificacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignacion } from 'src/asignacion/entities/asignacion.entity';
import { Notificacion } from './entities/notificacion.entity';

@Module({
  controllers: [NotificacionController],
  providers: [NotificacionService],
  imports: [
    TypeOrmModule.forFeature([Asignacion, Notificacion])
  ],
  exports: [NotificacionService]
})
export class NotificacionModule {}
