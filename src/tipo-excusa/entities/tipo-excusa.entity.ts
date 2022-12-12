import { Excusa } from "src/excusa/entities/excusa.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TipoExcusa {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text',{unique:true})
    descripcion: string;
    @Column('text')
    usuarioRegistro: string;
    
    @Column('timestamp')
    fechaRegistro: Date;
    
    @Column('boolean')
    registroActivo: boolean;

    @OneToMany(() => Excusa, (excusa) => excusa.tipoExcusa)
    excusas: Excusa[]
}
