import { Rol } from "src/roles/entities/rol.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permiso {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    descripcion: string;

    @Column('text')
    usuarioRegistro: string;
    @Column('timestamp')
    fechaRegistro: Date;
    @Column('boolean')
    registroActivo: boolean;

    @ManyToMany(() => Rol, (rol) => rol.permisos)
    roles: Rol[]
}
