import { Defensor } from "src/defensor/entities/defensor.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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
    nombre_completo: string;

    @Column('text')
    fotografia: string;
    
    @Column({ length: 1 })
    sexo: string;

    @Column('text')
    usuario_registro: string;
    
    @Column('timestamp')
    fecha_registro: Date;
    
    @Column('boolean')
    registro_activo: boolean;

    @OneToOne(() => Defensor, (defensor) => defensor.persona)
    defensor: Defensor  
}
