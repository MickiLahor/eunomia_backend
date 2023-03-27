import { Asignacion } from "src/asignacion/entities/asignacion.entity";
import { Materia } from "src/materia/entities/materia.entity";
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

    @ManyToOne(() => Materia, (materia)=> materia.procesos, 
                        {cascade:true,eager:true}
            )
    materia: Materia  

    @OneToMany(() => Asignacion, (asignacion) => asignacion.proceso,{eager:true})
    asignaciones: Asignacion[]
}
