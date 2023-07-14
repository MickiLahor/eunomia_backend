import { Defensor } from "src/defensor/entities/defensor.entity";
import { Excusa } from "src/excusa/entities/excusa.entity";
import { Informe } from "src/informe/entities/informe.entity";
import { Proceso } from "src/proceso/entities/proceso.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Asignacion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('date')
    fecha: Date;

    @Column('text')
    usuarioRegistro: string;

    @Column('timestamp')
    fechaRegistro: Date;

    @Column('boolean')
    registroActivo: boolean;

    @ManyToOne(() => Proceso, (proceso)=> proceso.asignaciones
            )
    proceso: Proceso  

    @ManyToOne(() => Defensor, (defensor)=> defensor.asignaciones,{cascade:true,eager:true}
            )
    defensor: Defensor 

    @OneToOne(() => Excusa, (excusa) => excusa.asignacion)
    excusa: Excusa  

    @OneToOne(() => Informe, (informe) => informe.asignacion)
    informe: Informe 
}
