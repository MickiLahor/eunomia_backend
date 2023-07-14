import { Asignacion } from "src/asignacion/entities/asignacion.entity";
import { TipoInforme } from "src/tipo_informe/entities/tipo_informe.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Informe {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    url: string;

    @Column('text')
    descripcion: string; 

    @Column('text')
    usuarioRegistro: string;

    @Column('timestamp')
    fechaRegistro: Date;

    @Column('boolean')
    registroActivo: boolean;

    @ManyToOne(() => TipoInforme, (tipo_informe)=> tipo_informe.informes, {cascade:true,eager:true})
    tipo_informe: TipoInforme

    @OneToOne(() => Asignacion, (asignacion) => asignacion.informe, {eager:true,cascade:true})
    @JoinColumn()
    asignacion: Asignacion
}
