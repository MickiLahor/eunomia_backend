import { Asignacion } from "src/asignacion/entities/asignacion.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Notificacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean')
  notificado_correo: boolean;

  @Column({type: 'timestamp', nullable: true})
  fecha_correo: Date;

  @Column('boolean')
  notificado_sms: boolean;

  @Column({type: 'timestamp', nullable: true})
  fecha_sms: Date;

  @Column('text')
  usuario_registro: string;

  @Column('timestamp')
  fecha_registro: Date;

  @Column('boolean')
  registro_activo: boolean;

  @Column({type: 'uuid', nullable: true})
  id_asignacion: string;

  @ManyToOne(() => Asignacion, (asignacion) => asignacion.notificaciones, {cascade:true})
  @JoinColumn({name: "id_asignacion"})
  asignacion: Asignacion
}
