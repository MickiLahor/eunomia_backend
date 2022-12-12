import { Proceso } from "src/proceso/entities/proceso.entity";
import { Column, Entity, PrimaryGeneratedColumn,OneToMany } from "typeorm";

@Entity()
export class TipoProceso {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text',{unique:true})
    descripcion: string;
    @Column('text')
    usuarioRegistro: string;
    
    @Column('timestamp')
    fechaRegistro: Date;
    
    @Column('boolean')
    registroActivo: boolean;

    @OneToMany(() => Proceso, (proceso) => proceso.tipoProceso)
    procesos: Proceso[]
}