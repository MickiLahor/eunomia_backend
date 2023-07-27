import { Informe } from "src/informe/entities/informe.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TipoInforme {
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

    @OneToMany(() => Informe, (informe) => informe.tipo_informe)
    informes: Informe[]
}
