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
    usuario_registro: string;

    @Column('timestamp')
    fecha_registro: Date;

    @Column('boolean')
    registro_activo: boolean;

    @ManyToOne(() => TipoInforme, (tipo_informe)=> tipo_informe.informes, {cascade:true,eager:true})
    @JoinColumn({ name: "id_tipo_informe" })
    tipo_informe: TipoInforme

    @ManyToOne(() => Asignacion, (asignacion) => asignacion.informe, {eager:true,cascade:true})
    @JoinColumn({name: "id_asignacion"})
    asignacion: Asignacion
}
