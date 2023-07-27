import { Defensor } from "src/defensor/entities/defensor.entity";
import { Proceso } from "src/proceso/entities/proceso.entity";
import { Column, Entity, PrimaryGeneratedColumn,OneToMany } from "typeorm";

@Entity()
export class Materia {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text',{unique:true})
    descripcion: string;
    @Column('text')
    usuario_registro: string;
    
    @Column('timestamp')
    fecha_registro: Date;
    
    @Column('boolean')
    registro_activo: boolean;

    @OneToMany(() => Proceso, (proceso) => proceso.materia)
    procesos: Proceso[]

    @OneToMany(() => Defensor, (defensor) => defensor.materia)
    defensores: Defensor[]
}