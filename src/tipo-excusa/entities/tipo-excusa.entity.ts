import { Excusa } from "src/excusa/entities/excusa.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TipoExcusa {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text',{unique:true})
    descripcion: string;
    @Column('text')
    usuario_registro: string;
    
    @Column('timestamp')
    fecha_registro: Date;
    
    @Column('boolean')
    registro_activo: boolean;

    @OneToMany(() => Excusa, (excusa) => excusa.tipo_excusa)
    excusas: Excusa[]
}
