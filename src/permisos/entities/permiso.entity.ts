import { Rol } from "src/roles/entities/rol.entity";
import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permiso {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    descripcion: string;

    @Column('text')
    usuario_registro: string;
    @Column('timestamp')
    fecha_registro: Date;
    @Column('boolean')
    registro_activo: boolean;

    @ManyToMany(() => Rol, (rol) => rol.permisos)
    roles: Rol[]
}
