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
    usuarioRegistro: string;

    @Column('timestamp')
    fechaRegistro: Date;

    @Column('boolean')
    registroActivo: boolean;

    @ManyToOne(() => TipoExcusa, (tipoExcusa)=> tipoExcusa.excusas, {cascade:true,eager:true})
    tipoExcusa: TipoExcusa

    @OneToOne(() => Asignacion, (asignacion) => asignacion.excusa, {eager:true,cascade:true})
    @JoinColumn()
    asignacion: Asignacion
}
