import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permiso {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    descripcion: string;

    @Column('text')
    usuarioRegistro: string;
    @Column('date')
    fechaRegistro: Date;
    @Column('bit')
    registroActivo: boolean;
}
