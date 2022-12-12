import { Asignacion } from "src/asignacion/entities/asignacion.entity";
import { Persona } from "src/persona/entities/persona.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Defensor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    direccionOficina: string;

    @Column('text')
    telefonoOficina: string;

    @Column('text')
    celular: string;

    @Column('text')
    correo: string;

    @Column('text')
    matricula: string;

    @Column('integer')
    idOficina: number;

    @Column('integer')
    idCiudad: number;

    @Column('date')
    fechaPosesion: Date;

    @Column('boolean')
    habilitado: boolean;

    @Column('boolean')
    sorteado: boolean;

    @Column('text')
    usuarioRegistro: string;

    @Column('timestamp')
    fechaRegistro: Date;

    @Column('boolean')
    registroActivo: boolean;

    @OneToOne(() => Persona, (persona) => persona.defensor, {eager:true,cascade:true})
    @JoinColumn()
    persona: Persona

    @OneToMany(() => Asignacion, (asignacion) => asignacion.defensor)
    asignaciones: Asignacion[]
}
