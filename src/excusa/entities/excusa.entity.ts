import { Asignacion } from "src/asignacion/entities/asignacion.entity";
import { TipoExcusa } from "src/tipo-excusa/entities/tipo-excusa.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Excusa {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    url: string;

    @Column('text')
    archivo: string;

    @Column('text')
    motivo: string; 

    @Column('text')
    usuario_registro: string;

    @Column('timestamp')
    fecha_registro: Date;

    @Column('boolean')
    registro_activo: boolean;

    @ManyToOne(() => TipoExcusa, (tipoExcusa)=> tipoExcusa.excusas, {cascade:true})
    @JoinColumn({name: "id_tipo_excusa"})
    tipo_excusa: TipoExcusa

    @OneToOne(() => Asignacion, (asignacion) => asignacion.excusa, {cascade:true})
    @JoinColumn({name: "id_asignacion"})
    asignacion: Asignacion
}
