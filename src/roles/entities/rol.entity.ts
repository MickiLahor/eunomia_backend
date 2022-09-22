import { Permiso } from "src/permisos/entities/permiso.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rol {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    descripcion: string;

    @Column('text')
    usuarioRegistro: string;
    @Column('date')
    fechaRegistro: Date;
    @Column('bit')
    registroActivo: boolean;

    @ManyToMany(() => Permiso) 
    @JoinTable({name:"rol_permiso"})
    permisos: Permiso[]
}
