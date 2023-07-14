import { Defensor } from "src/defensor/entities/defensor.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Persona {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text',{unique:true})
    ci: string;
    @Column('text')
    nombre: string;

    @Column('text')
    paterno: string;

    @Column('text')
    materno: string;

    @Column('text')
    nombreCompleto: string;

    @Column('text')
    fotografia: string;
    
    @Column({ length: 1 })
    sexo: string;

    @Column('text')
    usuarioRegistro: string;
    
    @Column('timestamp')
    fechaRegistro: Date;
    
    @Column('boolean')
    registroActivo: boolean;

    @OneToOne(() => Defensor, (defensor) => defensor.persona)
    defensor: Defensor  
}
