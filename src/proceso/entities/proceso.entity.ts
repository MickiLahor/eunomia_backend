import { Exclude } from "class-transformer";
import { Asignacion } from "src/asignacion/entities/asignacion.entity";
import { ZeusResponseDto } from "src/auth/dto/zeus-response.dto";
import { CommonService } from "src/common/common.service";
import { Materia } from "src/materia/entities/materia.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, ViewColumn } from "typeorm";

@Entity()
export class Proceso {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nurej: string;

    @Column('text')
    demandante: string;

    @Column('text')
    demandado: string; 

    @Column('integer')
    id_oficina: number;
    
    zeus: ZeusResponseDto
    
    @Column('integer')
    id_ciudad: number;

    @Column('text')
    usuario_registro: string;

    @Column('timestamp')
    fecha_registro: Date;

    @Column('boolean')
    registro_activo: boolean;

    @ManyToOne(() => Materia, (materia)=> materia.procesos, 
                        {cascade:true}
            )
    @JoinColumn({name: "id_materia"})
    materia: Materia  

    @OneToMany(() => Asignacion, (asignacion) => asignacion.proceso)
    asignaciones: Asignacion[]
}
