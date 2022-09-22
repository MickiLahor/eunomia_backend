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

    @Column('numeric')
    idOficina: number; 

    @Column('text')
    usuarioRegistro: string;
    @Column('date')
    fechaRegistro: Date;
    @Column('bit')
    registroActivo: boolean;

    @OneToOne(() => Persona)
    @JoinColumn()
    persona: Persona  

    @ManyToMany(() => Rol) 
    @JoinTable({name:"usuario_rol"})
    roles: Rol[]
}
