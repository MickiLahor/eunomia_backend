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
    @Column('timestamp')
    fechaRegistro: Date;
    @Column('boolean')
    registroActivo: boolean;

    @ManyToMany(() => Permiso, (permiso) => permiso.roles,{ eager:true,cascade:true }) 
    @JoinTable({name:"rol_permiso"})
    permisos: Permiso[]
}
