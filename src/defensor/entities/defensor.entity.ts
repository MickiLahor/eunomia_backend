import { Asignacion } from "src/asignacion/entities/asignacion.entity";
import { Materia } from "src/materia/entities/materia.entity";
import { Persona } from "src/persona/entities/persona.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Defensor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text', nullable: true})
    direccion_oficina: string;

    @Column({type: 'text', nullable: true})
    telefono_oficina: string;

    @Column('text')
    celular: string;

    @Column('text')
    correo: string;

    @Column('text')
    matricula: string;

    @Column({type: 'integer'})
    id_departamento: number;

    @Column('integer')
    id_ciudad: number;

    @Column('date')
    fecha_posesion: Date;

    @Column('boolean')
    habilitado: boolean;

    @Column('boolean')
    sorteado: boolean;

    @Column('text')
    usuario_registro: string;

    @Column('timestamp')
    fecha_registro: Date;

    @Column('boolean')
    registro_activo: boolean;

    @Column('uuid')
    id_materia: string;

    @OneToOne(() => Persona, (persona) => persona.defensor, {cascade:true})
    @JoinColumn({name:"id_persona"})
    persona: Persona

    @OneToMany(() => Asignacion, (asignacion) => asignacion.defensor)
    asignaciones: Asignacion[]

    @ManyToOne(() => Materia, (materia)=> materia.defensores, {cascade:true})
    @JoinColumn({name: "id_materia"})
    materia: Materia  
}
