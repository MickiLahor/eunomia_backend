import { Permiso } from "src/permisos/entities/permiso.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rol {
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

    @ManyToMany(() => Permiso, (permiso) => permiso.roles,{ cascade:true }) 
    @JoinTable({name:"rol_permiso",joinColumn:{name:"id_rol"},inverseJoinColumn:{name:"id_permiso"}})
    permisos: Permiso[]
}
