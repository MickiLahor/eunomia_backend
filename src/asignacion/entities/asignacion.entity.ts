import { Actividad } from 'src/actividad/entities/actividad.entity';
import { AsignacionEstado } from 'src/asignacion_estado/entities/asignacion_estado.entity';
import { Defensor } from 'src/defensor/entities/defensor.entity';
import { Estado } from 'src/estado/entities/estado.entity';
import { Excusa } from 'src/excusa/entities/excusa.entity';
import { Informe } from 'src/informe/entities/informe.entity';
import { Notificacion } from 'src/notificacion/entities/notificacion.entity';
import { Proceso } from 'src/proceso/entities/proceso.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  orderBy: {
    fecha_registro: 'DESC',
  },
})
export class Asignacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  fecha: Date;

  @Column('date')
  fecha_plazo: Date;

  @Column('text')
  usuario_registro: string;

  @Column('timestamp')
  fecha_registro: Date;

  @Column('boolean')
  registro_activo: boolean;

  @ManyToOne(() => Proceso, (proceso) => proceso.asignaciones)
  @JoinColumn({ name: 'id_proceso' })
  proceso: Proceso;

  @ManyToOne(() => Defensor, (defensor) => defensor.asignaciones, {
    cascade: true,
  })
  @JoinColumn({ name: 'id_defensor' })
  defensor: Defensor;

  @OneToOne(() => Excusa, (excusa) => excusa.asignacion)
  excusa: Excusa;

  @OneToMany(() => Informe, (informe) => informe.asignacion)
  informe: Informe;

  @OneToMany(() => AsignacionEstado, (asignaciones_estados) => asignaciones_estados.asignacion)
  asignaciones_estados: AsignacionEstado[];

  @OneToMany(() => Actividad, (actividad) => actividad.asignacion)
  actividades: Actividad[];

  @OneToMany(() => Notificacion, (notificacion) => notificacion.asignacion)
  notificaciones: Notificacion[];
}
