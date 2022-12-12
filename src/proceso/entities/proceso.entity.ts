import { Asignacion } from "src/asignacion/entities/asignacion.entity";
import { TipoProceso } from "src/tipoproceso/entities/tipoproceso.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Proceso {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nurej: string;

    @Column('text')
    demandante: string;

    @Column('text')
    demandado: string; 

    @Column('integer')
    idOficina: number;
    
    @Column('integer')
    idCiudad: number;

    @Column('text')
    usuarioRegistro: string;

    @Column('timestamp')
    fechaRegistro: Date;

    @Column('boolean')
    registroActivo: boolean;

    @ManyToOne(() => TipoProceso, (tipoProceso)=> tipoProceso.procesos, 
                        {cascade:true,eager:true}
            )
    tipoProceso: TipoProceso  

    @OneToMany(() => Asignacion, (asignacion) => asignacion.proceso,{eager:true})
    asignaciones: Asignacion[]
}
