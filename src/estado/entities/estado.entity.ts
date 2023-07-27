import { Asignacion } from "src/asignacion/entities/asignacion.entity";
import { AsignacionEstado } from "src/asignacion_estado/entities/asignacion_estado.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Estado {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    descripcion: string;

    @Column('date')
    fecha: Date;

    @Column('text')
    usuario_registro: string;

    @Column('timestamp')
    fecha_registro: Date;

    @Column('boolean')
    registro_activo: boolean;

    @OneToMany(() => AsignacionEstado, (asignaciones_estados) => asignaciones_estados.estado)
    asignaciones_estados: AsignacionEstado[]
}
