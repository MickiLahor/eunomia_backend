import { Asignacion } from "src/asignacion/entities/asignacion.entity";
import { Estado } from "src/estado/entities/estado.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AsignacionEstado {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('date')
    fecha: Date;

    @Column('text')
    usuario_registro: string;

    @Column('timestamp')
    fecha_registro: Date;

    @Column('boolean')
    registro_activo: boolean;

    @ManyToOne(() => Estado, (estado)=> estado.asignaciones_estados,{cascade:true,eager:true}
    )
    @JoinColumn({name: "id_estado"})
    estado: Estado
    
    @ManyToOne(() => Asignacion, (asignacion)=> asignacion.asignaciones_estados,{cascade:true,eager:true}
    )
    @JoinColumn({name: "id_asignacion"})
    asignacion: Asignacion
}
