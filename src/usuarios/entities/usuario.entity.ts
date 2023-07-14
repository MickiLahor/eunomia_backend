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
    @OneToOne(() => Persona,{cascade:true,eager:true})
    @JoinColumn()
    persona: Persona  
    @ManyToMany(() => Rol, {eager:true}) 
    @JoinTable({name:"usuario_rol"})
    roles: Rol[]
}
