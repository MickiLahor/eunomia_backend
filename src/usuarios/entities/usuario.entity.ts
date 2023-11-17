import { Persona } from "src/persona/entities/persona.entity";
import { Rol } from "src/roles/entities/rol.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    usuario: string;

    @Column('text')
    clave: string;

    @Column({type: 'integer', nullable: true})
    id_oficina: number; 

    @Column('integer')
    id_ciudad: number;

    @Column({ type: 'integer', nullable: true})
    id_departamento: number; 

    @Column('text')
    usuario_registro: string;

    @Column('timestamp')
    fecha_registro: Date;

    @Column('boolean')
    registro_activo: boolean;

    // @Column('uuid')
    // id_persona: string;
    @OneToOne(() => Persona,{cascade:true})
    @JoinColumn({name:"id_persona"})
    persona: Persona
    
    @ManyToMany(() => Rol) 
    @JoinTable({name:"usuario_rol",joinColumn:{name:"id_usuario"},inverseJoinColumn:{name:"id_rol"}})
    roles: Rol[]
}
