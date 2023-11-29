import { Asignacion } from "src/asignacion/entities/asignacion.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Actividad {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    descripcion: string;

    @Column('date')
    fecha_inicio: Date;

    @Column('date')
    fecha_fin: Date;

    @Column('boolean')
    finalizado: boolean;

    @Column('text')
    usuario_registro: string;

    @Column('timestamp')
    fecha_registro: Date;

    @Column('boolean')
    registro_activo: boolean;

    // @Column('uuid')
    // id_asignacion: string;

    @ManyToOne(() => Asignacion, (asignacion)=> asignacion.actividades, {cascade:true})
    @JoinColumn({name: "id_asignacion"})
    asignacion: Asignacion  
}
