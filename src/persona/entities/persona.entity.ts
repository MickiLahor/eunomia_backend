import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Persona {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text',{
        unique:true
    })
    ci: string;
    @Column('text')
    nombre: string;

    @Column('text')
    paterno: string;

    @Column('text')
    materno: string;

    @Column('text')
    fotografia: string;

    @Column('text')
    usuarioRegistro: string;
    
    @Column('date')
    fechaRegistro: Date;
    
    @Column('bit')
    registroActivo: boolean;

    // @OneToMany(() => Usuario,
    // (usuario) => usuario.persona,
    // {cascade:true, eager:true}
    // )
    // usuario: Usuario;
}
