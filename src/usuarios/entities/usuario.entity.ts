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
    id_oficina: number; 
    @Column('integer')
    id_ciudad: number; 
    @Column('text')
    usuario_registro: string;
    @Column('timestamp')
    fecha_registro: Date;
    @Column('boolean')
    registro_activo: boolean;
    @OneToOne(() => Persona,{cascade:true,eager:true})
    @JoinColumn()
    persona: Persona  
    @ManyToMany(() => Rol, {eager:true}) 
    @JoinTable({name:"usuario_rol",joinColumn:{name:"id_usuario"},inverseJoinColumn:{name:"id_rol"}})
    roles: Rol[]
}
